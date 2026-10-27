import Ionicons from '@react-native-vector-icons/ionicons'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import type React from 'react'
import { useMemo, useState } from 'react'
import {
  type LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native'
import {
  Camera,
  type PreviewConfiguration,
  type Size,
  useCameraDevice,
} from 'react-native-vision-camera'
import { useIsActive } from '../hooks/useIsActive'
import { useSafeAreaPadding } from '../hooks/useSafeAreaPadding'

function formatRatio(value: number | undefined): string {
  return value == null ? '—' : value.toFixed(3)
}

function getContainedSize(area: Size, aspectRatio: number): Size {
  if (area.width / area.height > aspectRatio) {
    return { width: area.height * aspectRatio, height: area.height }
  }
  return { width: area.width, height: area.width / aspectRatio }
}

export function UprightPreviewScreen(): React.ReactElement {
  const navigation = useNavigation()
  const safePadding = useSafeAreaPadding(16)
  const isFocused = useIsFocused()
  const isAppActive = useIsActive()
  const window = useWindowDimensions()
  const device = useCameraDevice('back')
  const [configuration, setConfiguration] = useState<PreviewConfiguration>()
  const [uprightResolution, setUprightResolution] = useState<Size>()
  const [workspaceSize, setWorkspaceSize] = useState<Size>()
  const [configurationHeight, setConfigurationHeight] = useState(0)

  const uprightAspectRatio =
    uprightResolution == null
      ? undefined
      : uprightResolution.width / uprightResolution.height
  const isLandscape = window.width > window.height
  const previewSize = useMemo(() => {
    if (workspaceSize == null) return undefined

    const availableWidth = isLandscape
      ? workspaceSize.width - Math.min(320, workspaceSize.width * 0.38) - 16
      : workspaceSize.width
    const availableHeight = isLandscape
      ? workspaceSize.height
      : workspaceSize.height - (configurationHeight || 140) - 14
    if (availableWidth <= 0 || availableHeight <= 0) return undefined

    return getContainedSize(
      { width: availableWidth, height: availableHeight },
      uprightAspectRatio ?? 3 / 4,
    )
  }, [configurationHeight, isLandscape, uprightAspectRatio, workspaceSize])

  const handleWorkspaceLayout = ({ nativeEvent }: LayoutChangeEvent) => {
    const { width, height } = nativeEvent.layout
    setWorkspaceSize((current) =>
      current?.width === width && current.height === height
        ? current
        : { width, height },
    )
  }

  const handleConfigurationLayout = ({ nativeEvent }: LayoutChangeEvent) => {
    const { height } = nativeEvent.layout
    setConfigurationHeight((current) => (current === height ? current : height))
  }

  if (device == null) {
    return (
      <View style={[styles.loadingContainer, safePadding]}>
        <Text style={styles.loadingText}>Waiting for a camera device…</Text>
      </View>
    )
  }

  return (
    <View style={[styles.container, safePadding]}>
      <View style={styles.navigationRow}>
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons color="white" name="chevron-back" size={24} />
        </Pressable>
        <View>
          <Text style={styles.eyebrow}>PREVIEW LAB</Text>
          <Text style={styles.title}>Upright resolution</Text>
        </View>
      </View>

      <View
        onLayout={handleWorkspaceLayout}
        style={[styles.workspace, isLandscape && styles.workspaceLandscape]}
      >
        {previewSize == null ? null : (
          <View style={[styles.previewFrame, previewSize]}>
            <Camera
              device={device}
              isActive={isAppActive && isFocused}
              onPreviewConfigurationChanged={setConfiguration}
              onPreviewResolution={setUprightResolution}
              orientationSource="device"
              resizeMode="cover"
              style={StyleSheet.absoluteFill}
            />
            {uprightAspectRatio == null ? (
              <View style={styles.waitingOverlay}>
                <Text style={styles.loadingText}>Reading configuration…</Text>
              </View>
            ) : null}
          </View>
        )}

        <View
          onLayout={handleConfigurationLayout}
          style={[
            styles.configurationCard,
            isLandscape && styles.configurationCardLandscape,
          ]}
        >
          <Text style={styles.sectionEyebrow}>PREVIEW DIMENSIONS</Text>
          <View style={styles.metricsRow}>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>
                {configuration == null
                  ? '—'
                  : `${configuration.resolution.width} × ${configuration.resolution.height}`}
              </Text>
              <Text style={styles.metricLabel}>native resolution</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>
                {configuration?.rotationDegrees ?? '—'}°
              </Text>
              <Text style={styles.metricLabel}>rotation</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.metricsRow}>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>
                {uprightResolution == null
                  ? '—'
                  : `${uprightResolution.width} × ${uprightResolution.height}`}
              </Text>
              <Text style={styles.metricLabel}>upright resolution</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.highlightValue}>
                {formatRatio(uprightAspectRatio)}
              </Text>
              <Text style={styles.metricLabel}>upright aspect ratio</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#090b0f',
    flex: 1,
  },
  loadingContainer: {
    alignItems: 'center',
    backgroundColor: '#090b0f',
    flex: 1,
    justifyContent: 'center',
  },
  loadingText: {
    color: '#a9adb5',
    fontSize: 15,
  },
  navigationRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
    marginTop: 8,
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: '#1a1d23',
    borderRadius: 16,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  eyebrow: {
    color: '#d9ff57',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.6,
    marginBottom: 2,
  },
  title: {
    color: 'white',
    fontSize: 21,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  workspace: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  workspaceLandscape: {
    flexDirection: 'row',
    gap: 16,
  },
  previewFrame: {
    backgroundColor: '#15181e',
    borderColor: '#343945',
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
  },
  waitingOverlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(9, 11, 15, 0.72)',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  configurationCard: {
    backgroundColor: '#15181e',
    borderColor: '#292d35',
    borderRadius: 18,
    borderWidth: 1,
    marginTop: 14,
    padding: 16,
    width: '100%',
  },
  configurationCardLandscape: {
    marginTop: 0,
    maxWidth: 320,
    width: '38%',
  },
  sectionEyebrow: {
    color: '#777d87',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.1,
    marginBottom: 13,
  },
  metricsRow: {
    flexDirection: 'row',
  },
  metric: {
    flex: 1,
  },
  metricValue: {
    color: 'white',
    fontSize: 15,
    fontVariant: ['tabular-nums'],
    fontWeight: '600',
  },
  highlightValue: {
    color: '#d9ff57',
    fontSize: 15,
    fontVariant: ['tabular-nums'],
    fontWeight: '700',
  },
  metricLabel: {
    color: '#777d87',
    fontSize: 9,
    marginTop: 4,
  },
  divider: {
    backgroundColor: '#292d35',
    height: StyleSheet.hairlineWidth,
    marginVertical: 13,
  },
})
