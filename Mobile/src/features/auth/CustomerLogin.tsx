import {
  Alert,
  Animated,
  Image,
  Keyboard,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import {
  GestureHandlerRootView,
  PanGestureHandler,
  State,
} from 'react-native-gesture-handler'
import CustomSafeAreaView from '@components/global/CustomSafeAreaView'
import ProductSlider from '@components/login/ProductSlider'
import { Colors, Fonts, lightColors } from '@utils/Constants'
import CustomText from '@components/ui/CustomText'
import { RFValue } from 'react-native-responsive-fontsize'
import { resetAndNavigate } from '@utils/NavigationUtils'
import useKeyboardOffsetHeight from '@utils/useKeyboardOffsetHeight'
import LinearGradient from 'react-native-linear-gradient'
import CustomInput from '@components/ui/CustomInput'
import CustomButton from '@components/ui/CustomButton'
import { customerLogin } from '../../services/authService'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const bottomColors = [...lightColors].reverse()

const CustomerLogin = () => {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [gestureSequence, setGestureSequence] = useState<string[]>([])
  const animatedValue = useRef(new Animated.Value(0)).current
  const keyboardOffsetHeight = useKeyboardOffsetHeight()

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: keyboardOffsetHeight === 0 ? 0 : -keyboardOffsetHeight * 0.84,
      duration: 600,
      useNativeDriver: true,
    }).start()
  }, [keyboardOffsetHeight])

  const handleGesture = ({ nativeEvent }: any) => {
    if (nativeEvent.state === State.END) {
      const { translationX, translationY } = nativeEvent
      let direction = ''

      if (Math.abs(translationX) > Math.abs(translationY)) {
        direction = translationX > 0 ? 'right' : 'left'
      } else {
        direction = translationY > 0 ? 'down' : 'up'
      }

      const newSequence = [...gestureSequence, direction].slice(-5)
      setGestureSequence(newSequence)

      if (newSequence.join(' ') === 'up up down left right') {
        setGestureSequence([])
        resetAndNavigate('DeliveryLogin')
      }
    }
  }

  // ✅ FIXED LOGIN HANDLER
  const handleAuth = async () => {
    if (loading) return
    if (phoneNumber.length !== 10) return

    Keyboard.dismiss()
    setLoading(true)

    try {
      await customerLogin(phoneNumber)
      // ❌ YAHAN NAVIGATION NAHI KARENGE
      // ✅ SplashScreen auth state ke basis pe navigate karega
    } catch (error) {
      Alert.alert('Login Failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <CustomSafeAreaView>
          <ProductSlider />

          <PanGestureHandler onHandlerStateChange={handleGesture}>
            <Animated.ScrollView
              bounces={false}
              style={{ transform: [{ translateY: animatedValue }] }}
              keyboardDismissMode="on-drag"
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.subContainer}
            >
              <LinearGradient colors={bottomColors} style={styles.gradient} />

              <View style={styles.content}>
                <Image
                  source={require('@assets/images/logo.jpeg')}
                  style={styles.logo}
                />

                <CustomText variant="h2" fontFamily={Fonts.Bold}>
                  Grocery Delivery App
                </CustomText>

                <CustomText
                  variant="h5"
                  fontFamily={Fonts.SemiBold}
                  style={styles.text}
                >
                  Log in or Sign up
                </CustomText>

                <CustomInput
                  value={phoneNumber}
                  onChangeText={(text) => setPhoneNumber(text.slice(0, 10))}
                  onClear={() => setPhoneNumber('')}
                  placeholder="Enter Phone number"
                  inputMode="numeric"
                  left={
                    <CustomText
                      variant="h6"
                      fontFamily={Fonts.SemiBold}
                      style={styles.phoneText}
                    >
                      +91
                    </CustomText>
                  }
                />

                <CustomButton
                  title="Continue"
                  onPress={handleAuth}
                  loading={loading}
                  disabled={phoneNumber.length !== 10}
                />
              </View>
            </Animated.ScrollView>
          </PanGestureHandler>
        </CustomSafeAreaView>

        <TouchableOpacity
          style={styles.absolutSwitch}
          onPress={() => resetAndNavigate('DeliveryLogin')}
        >
          <Icon name="bike-fast" color="#000" size={RFValue(22)} />
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  )
}

export default CustomerLogin

const styles = StyleSheet.create({
  container: { flex: 1 },

  absolutSwitch: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 40 : 20,
    right: 10,
    backgroundColor: '#fff',
    elevation: 10,
    padding: 10,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    zIndex: 99,
  },

  subContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 40,
  },

  gradient: {
    paddingTop: 60,
    width: '100%',
  },

  content: {
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingBottom: 80,
  },

  logo: {
    height: 50,
    width: 50,
    borderRadius: 20,
    marginVertical: 10,
  },

  text: {
    marginTop: 2,
    marginBottom: 10,
    opacity: 0.8,
  },

  phoneText: {
    marginLeft: 10,
  },
})
