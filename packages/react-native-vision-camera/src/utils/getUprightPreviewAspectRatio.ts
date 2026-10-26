import type { PreviewConfiguration } from '../specs/outputs/CameraPreviewOutput.nitro'

/**
 * Calculates the Preview stream's aspect ratio after applying the rotation
 * required to display it upright.
 *
 * Returns `undefined` when the rotation is not available, such as on iOS 16
 * and older, or when the resolution is invalid.
 */
export function getUprightPreviewAspectRatio(
  configuration: PreviewConfiguration | undefined,
): number | undefined {
  if (configuration?.rotationDegrees == null) return undefined

  const { width, height } = configuration.resolution
  if (width <= 0 || height <= 0) return undefined

  const rotation = configuration.rotationDegrees
  const swapsDimensions = rotation === 90 || rotation === 270

  return swapsDimensions ? height / width : width / height
}
