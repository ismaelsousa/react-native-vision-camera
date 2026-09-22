import type { HybridObject } from 'react-native-nitro-modules'
import type { Point } from './Point'
import type { RecognizedLanguage } from './RecognizedLanguage.nitro'
import type { Rect } from './Rect'
import type { TextLine } from './TextLine.nitro'

/** A block of text, similar to a paragraph, recognized by ML Kit. */
export interface TextBlock
  extends HybridObject<{ ios: 'swift'; android: 'kotlin' }> {
  readonly text: string
  readonly lines: TextLine[]
  readonly boundingBox: Rect | undefined
  readonly cornerPoints: Point[]
  readonly recognizedLanguages: RecognizedLanguage[]
}
