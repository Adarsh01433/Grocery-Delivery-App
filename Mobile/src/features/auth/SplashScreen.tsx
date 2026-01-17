import { Alert, Image, StyleSheet, View } from 'react-native'
import React, { FC, useEffect } from 'react'
import { Colors } from '@utils/Constants'
import Logo from '@assets/images/logo.jpeg'
import { screenHeight, screenWidth } from '@utils/Scaling'
import { resetAndNavigate } from '@utils/NavigationUtils'
import GeoLocation from '@react-native-community/geolocation'
import { useAuthStore } from '@state/authStore'
import { tokenStorage } from '@state/storage'
import { jwtDecode } from 'jwt-decode'
import { refetchUser, refresh_token } from 'services/authService'

GeoLocation.setRNConfiguration({
  skipPermissionRequests: false,
  authorizationLevel: 'always',
  enableBackgroundLocationUpdates: true,
  locationProvider: 'auto',
})

interface DecodedToken {
  exp: number
}

const SplashScreen: FC = () => {
  const { setUser } = useAuthStore()

  const tokenCheck = async () => {
    const accessToken = tokenStorage.getString('accessToken')
    const refreshToken = tokenStorage.getString('refreshToken')

    // ❌ No tokens → login
    if (!accessToken || !refreshToken) {
      resetAndNavigate('CustomerLogin')
      return
    }

    let decodedAccessToken: DecodedToken
    let decodedRefreshToken: DecodedToken

    try {
      decodedAccessToken = jwtDecode(accessToken)
      decodedRefreshToken = jwtDecode(refreshToken)
    } catch {
      resetAndNavigate('CustomerLogin')
      return
    }

    const currentTime = Date.now() / 1000

    // ❌ Refresh token expired
    if (decodedRefreshToken.exp < currentTime) {
      Alert.alert('Session expired', 'Please login again', [
        { text: 'OK', onPress: () => resetAndNavigate('CustomerLogin') },
      ])
      return
    }

    // 🔄 Access token expired → refresh
    if (decodedAccessToken.exp < currentTime) {
      try {
        await refresh_token()
      } catch {
        resetAndNavigate('CustomerLogin')
        return
      }
    }

    // ✅ Fetch latest user
    try {
      await refetchUser(setUser)
    } catch {
      resetAndNavigate('CustomerLogin')
      return
    }

    const user = useAuthStore.getState().user

    if (user?.role === 'Customer') {
      resetAndNavigate('ProductDashboard')
    } else {
      resetAndNavigate('DeliveryDashboard')
    }
  }

  useEffect(() => {
    const initialStartup = async () => {
      try {
        // ⚠️ requestAuthorization returns void → no comparison
        GeoLocation.requestAuthorization()

        await tokenCheck()
      } catch {
        Alert.alert(
          'Location required',
          'We need location permission to continue',
          [{ text: 'OK', onPress: () => resetAndNavigate('CustomerLogin') }]
        )
      }
    }

    const timeoutId = setTimeout(initialStartup, 1000)
    return () => clearTimeout(timeoutId)
  }, [])

  return (
    <View style={styles.container}>
      <Image style={styles.logoImage} source={Logo} />
    </View>
  )
}

export default SplashScreen

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    height: screenHeight * 0.7,
    width: screenWidth * 0.7,
    resizeMode: 'contain',
  },
})
