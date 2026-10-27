import {
  createStaticNavigation,
  type StaticParamList,
} from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { VisionCamera } from 'react-native-vision-camera'
import { AdaptiveControlsScreen } from './screens/AdaptiveControlsScreen'
import { CameraScreen } from './screens/CameraScreen'
import { HomeScreen } from './screens/HomeScreen'
import { PermissionsScreen } from './screens/PermissionsScreen'
import { PhotoScreen } from './screens/PhotoScreen'
import { PictureInPictureScreen } from './screens/PictureInPictureScreen'
import { PreviewLabScreen } from './screens/PreviewLabScreen'
import { UprightPreviewScreen } from './screens/UprightPreviewScreen'
import { VideoScreen } from './screens/VideoScreen'

const RootStack = createNativeStackNavigator({
  initialRouteName:
    VisionCamera.cameraPermissionStatus === 'authorized'
      ? 'Home'
      : 'Permissions',
  screens: {
    Permissions: PermissionsScreen,
    Home: HomeScreen,
    Camera: {
      screen: CameraScreen,
      options: {
        orientation: 'portrait_up',
      },
    },
    PreviewLab: {
      screen: PreviewLabScreen,
      options: {
        orientation: 'all',
      },
    },
    AdaptiveControls: {
      screen: AdaptiveControlsScreen,
      options: {
        orientation: 'all',
      },
    },
    PictureInPicture: {
      screen: PictureInPictureScreen,
      options: {
        orientation: 'all',
      },
    },
    UprightPreview: {
      screen: UprightPreviewScreen,
      options: {
        orientation: 'all',
      },
    },
    Photo: {
      screen: PhotoScreen,
      options: {
        animation: 'none',
        presentation: 'transparentModal',
      },
    },
    Video: {
      screen: VideoScreen,
      options: {
        animation: 'none',
        presentation: 'transparentModal',
      },
    },
  },
  screenOptions: {
    navigationBarHidden: true,
    headerShown: false,
    contentStyle: {
      backgroundColor: 'black',
    },
  },
})

type RootStackParamList = StaticParamList<typeof RootStack>

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

const Navigation = createStaticNavigation(RootStack)

function App() {
  return (
    <GestureHandlerRootView>
      <Navigation />
    </GestureHandlerRootView>
  )
}

export default App
