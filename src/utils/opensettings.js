import { Platform, Linking } from 'react-native'
import IntentLauncher from 'react-native-intent-launcher';

export const openAirplaneModeSettings = () => {
  if (Platform.OS === 'ios') {
    Linking.openURL('App-prefs:root=General&path=AIRPLANE_MODE')
  } else {
    IntentLauncher.startActivity({
      action: "android.settings.AIRPLANE_MODE_SETTINGS"
    })
  }
}