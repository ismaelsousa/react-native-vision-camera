import Ionicons, {
  type IoniconsIconName,
} from '@react-native-vector-icons/ionicons'
import { useNavigation } from '@react-navigation/native'
import type React from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaPadding } from '../hooks/useSafeAreaPadding'

interface DemoCardProps {
  description: string
  icon: IoniconsIconName
  onPress: () => void
  title: string
}

function DemoCard({
  description,
  icon,
  onPress,
  title,
}: DemoCardProps): React.ReactElement {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.iconContainer}>
        <Ionicons color="#d9ff57" name={icon} size={26} />
      </View>
      <View style={styles.cardCopy}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription}>{description}</Text>
      </View>
      <Ionicons color="#8d929b" name="chevron-forward" size={22} />
    </Pressable>
  )
}

export function HomeScreen(): React.ReactElement {
  const navigation = useNavigation()
  const safePadding = useSafeAreaPadding(16)

  return (
    <ScrollView
      contentContainerStyle={[styles.container, safePadding]}
      style={styles.screen}
    >
      <View style={styles.header}>
        <Text style={styles.eyebrow}>VISION CAMERA</Text>
        <Text style={styles.title}>Choose a demo</Text>
        <Text style={styles.subtitle}>
          Explore the full camera or inspect how the Preview configuration
          responds to rotation.
        </Text>
      </View>

      <View style={styles.cards}>
        <DemoCard
          description="Capture photos and exercise the complete camera setup."
          icon="camera-outline"
          onPress={() => navigation.navigate('Camera')}
          title="Camera"
        />
        <DemoCard
          description="Observe resolution and rotation, then resize the Preview."
          icon="scan-outline"
          onPress={() => navigation.navigate('PreviewLab')}
          title="Preview Lab"
        />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#090b0f',
  },
  container: {
    backgroundColor: '#090b0f',
    flexGrow: 1,
    paddingBottom: 24,
  },
  header: {
    marginTop: 54,
    marginBottom: 36,
  },
  eyebrow: {
    color: '#d9ff57',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2.2,
    marginBottom: 12,
  },
  title: {
    color: 'white',
    fontSize: 38,
    fontWeight: '700',
    letterSpacing: -1.2,
  },
  subtitle: {
    color: '#a9adb5',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 12,
    maxWidth: 420,
  },
  cards: {
    gap: 14,
  },
  card: {
    alignItems: 'center',
    backgroundColor: '#15181e',
    borderColor: '#292d35',
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: 'row',
    padding: 18,
  },
  cardPressed: {
    backgroundColor: '#20242b',
    transform: [{ scale: 0.99 }],
  },
  iconContainer: {
    alignItems: 'center',
    backgroundColor: '#252a20',
    borderRadius: 16,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  cardCopy: {
    flex: 1,
    marginHorizontal: 16,
  },
  cardTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  cardDescription: {
    color: '#969ba5',
    fontSize: 14,
    lineHeight: 20,
  },
})
