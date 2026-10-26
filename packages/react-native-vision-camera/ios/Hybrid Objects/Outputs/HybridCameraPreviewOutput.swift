///
/// HybridCameraPreviewOutput.swift
/// VisionCamera
/// Copyright © 2025 Marc Rousavy @ Margelo
///

import AVFoundation
import Foundation
import NitroModules

final class HybridCameraPreviewOutput: HybridCameraPreviewOutputSpec, NativePreviewViewOutput {
  let mediaType: MediaType = .video
  let previewLayer: AVCaptureVideoPreviewLayer
  private let orientationManager = HybridInterfaceOrientationManager()
  private var formatDescriptionObserver: NSObjectProtocol?
  private let onConfigurationChanged: ((PreviewConfiguration) -> Void)?
  private(set) var currentConfiguration: PreviewConfiguration?
  var outputOrientation: CameraOrientation {
    get {
      return previewLayer.connection?.orientation ?? .up
    }
    set {
      // Setting orientation on a Preview output does nothing,
      // as its orientation is always driven by the `orientationManager`.
    }
  }
  var currentResolution: Size? {
    guard let connection = previewLayer.connection else { return nil }
    return connection.inputStreamResolution
  }
  var rotationDegrees: Double? {
    guard let connection = previewLayer.connection else { return nil }
    return connection.rotationDegrees
  }

  var streamType: StreamType = .video
  /// The Preview can never display more pixels than the screen has,
  /// so any Format at least as large as the screen (`>=`) is a perfect
  /// match - hence `.min`. This is only a _bias_; a slightly smaller
  /// Format only gets a small penalty (it is upscaled on-screen), so
  /// other outputs (e.g. a video recording with an explicit
  /// `targetResolution`) can still win the resolution negotiation.
  ///
  /// We use the screen size instead of the actual view size here
  /// because the view might not even be laid out yet at the time
  /// the resolution negotiation runs.
  var targetResolution: ResolutionRule {
    let screenSizeDp = UIScreen.main.bounds.size
    let pixelRatio = UIScreen.main.scale
    let screenSizePx = Size(
      width: screenSizeDp.width * pixelRatio,
      height: screenSizeDp.height * pixelRatio)
    return .min(screenSizePx)
  }

  init(options: PreviewOutputOptions) {
    self.previewLayer = AVCaptureVideoPreviewLayer()
    self.onConfigurationChanged = options.onConfigurationChanged
    self.previewLayer.videoGravity = .resizeAspectFill
    super.init()
    self.orientationManager.startOrientationUpdates { [weak self] orientation in
      guard let self else { return }
      if let connection = self.previewLayer.connection {
        try? connection.setOrientation(orientation)
        self.updatePreviewConfiguration(connection, source: "interface orientation changed")
      }
    }
  }

  deinit {
    stopObservingFormatDescription()
    orientationManager.stopOrientationUpdates()
  }

  func configure(config: OutputConfiguration) {
    stopObservingFormatDescription()
    guard let connection = previewLayer.connection else {
      return
    }
    try? connection.setMirrorMode(config.mirrorMode)
    if let interfaceOrientation = orientationManager.currentOrientation {
      try? connection.setOrientation(interfaceOrientation)
    }
    observeFormatDescription(on: connection)
  }

  private func observeFormatDescription(on connection: AVCaptureConnection) {
    guard let port = connection.inputPorts.first else {
      logger.warning("[PreviewConfiguration] Cannot observe Preview dimensions: input port is not available.")
      return
    }

    formatDescriptionObserver = NotificationCenter.default.addObserver(
      forName: AVCaptureInput.Port.formatDescriptionDidChangeNotification,
      object: port,
      queue: nil
    ) { [weak self, weak connection] _ in
      guard let self, let connection else { return }
      self.updatePreviewConfiguration(connection, source: "format description changed")
    }

    updatePreviewConfiguration(connection, source: "observer attached")
  }

  private func stopObservingFormatDescription() {
    guard let formatDescriptionObserver else { return }
    NotificationCenter.default.removeObserver(formatDescriptionObserver)
    self.formatDescriptionObserver = nil
  }

  private func updatePreviewConfiguration(
    _ connection: AVCaptureConnection,
    source: String
  ) {
    let activeFormatResolution = connection.inputPorts.first.flatMap { port in
      (port.input as? AVCaptureDeviceInput).map {
        Size(dimensions: $0.device.activeFormat.formatDescription.dimensions)
      }
    }
    let resolution = connection.inputStreamResolution ?? activeFormatResolution
    let rotationDegrees = connection.rotationDegrees
    guard let resolution else {
      logger.warning(
        "[PreviewConfiguration] Cannot determine Preview resolution (\(source))."
      )
      return
    }

    let configuration = PreviewConfiguration(
      resolution: resolution,
      rotationDegrees: rotationDegrees)
    if let currentConfiguration,
      currentConfiguration.resolution.width == configuration.resolution.width,
      currentConfiguration.resolution.height == configuration.resolution.height,
      currentConfiguration.rotationDegrees == configuration.rotationDegrees
    {
      return
    }
    currentConfiguration = configuration

    logger.info(
      "[PreviewConfiguration] Preview configuration changed (\(source)): \(resolution.width)x\(resolution.height) @ \(String(describing: rotationDegrees))°"
    )
    onConfigurationChanged?(configuration)
  }
}
