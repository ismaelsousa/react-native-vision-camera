///
/// AVCaptureConnection+rotationDegrees.swift
/// VisionCamera
/// Copyright © 2026 Marc Rousavy @ Margelo
///

import AVFoundation
import Foundation

extension AVCaptureConnection {
  var rotationDegrees: Double? {
    if #available(iOS 17.0, *) {
      return videoRotationAngle
    }
    return nil
  }
}
