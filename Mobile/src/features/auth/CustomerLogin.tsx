import { Animated, Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { GestureHandlerRootView, PanGestureHandler, State } from "react-native-gesture-handler"
import CustomSafeAreaView from '@components/global/CustomSafeAreaView'
import ProductSlider from '@components/login/ProductSlider'
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Fonts, lightColors } from '@utils/Constants'
import CustomText from '@components/ui/CustomText'
import { RFValue } from 'react-native-responsive-fontsize'
import { resetAndNavigate } from '@utils/NavigationUtils'
import useKeyboardOffsetHeight from '@utils/useKeyboardOffsetHeight'
import LinearGradient from 'react-native-linear-gradient'
import CustomInput from '@components/ui/CustomInput'
import CustomButton from '@components/ui/CustomButton'


const bottomColors = [...lightColors].reverse()

const CustomerLogin = () => {

  const [phoneNumber, setPhoneNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [gestureSequence, setGestureSequence] = useState<string[]>([])
  const animatedValue = useRef(new Animated.Value(0)).current
  const keyboardOffsetHeight = useKeyboardOffsetHeight()

  useEffect(() => {
    if (keyboardOffsetHeight === 0) {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true
      }).start()
    } else {
      Animated.timing(animatedValue, {
        toValue: -keyboardOffsetHeight * 0.84,
        duration: 1000,
        useNativeDriver: true
      }).start()
    }
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
      if (newSequence?.join(' ') === 'up up down left right') {
        setGestureSequence([])
        resetAndNavigate("DeliveryLogin")
      }
    }
  }


  const handleAuth = async()=> {
        CustomerLogin
  }
  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        <CustomSafeAreaView>
          <ProductSlider />

          <PanGestureHandler onHandlerStateChange={handleGesture}>
            <Animated.ScrollView bounces={false}
            style = {{transform : [{translateY : animatedValue}]}}
              keyboardDismissMode="on-drag"
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.subContainer}>
              <LinearGradient  colors={bottomColors} style = {styles.gradient} />
              <View style = {styles.content}>
                <Image source={require('@assets/images/logo.jpeg')}
                style = {styles.logo}/>
                
                <CustomText variant='h2' fontFamily={Fonts.Bold}>
                  Grocery Delivery App
                </CustomText>
                <CustomText variant='h5' fontFamily={Fonts.SemiBold} style={styles.text}>
                  Log in or Sign up
                </CustomText>

                <CustomInput 
                onChangeText={(text)=> setPhoneNumber(text.slice(0,10))}
                onClear={()=>setPhoneNumber("")}
                value={phoneNumber}
                placeholder='Enter Phone number'
                inputMode='numeric'
                left = {
                  <CustomText variant='h6'
                  fontFamily={Fonts.SemiBold}
                   style={styles.phoneText}>
                    +91
                  </CustomText>
                }
                />
                <CustomButton 
                disabled = {phoneNumber?.length != 10}
                onPress={()=>handleAuth()}
                loading = {loading}
                title='Continue'
                />
             
              </View>

            </Animated.ScrollView>
          </PanGestureHandler>

        </CustomSafeAreaView>
      {/* fix this later */}
        {/* <View style={styles.footer}>
          <SafeAreaView />
          <CustomText fontSize={RFValue(8)}  style={{textAlign : "center",}} >
            By Continuing, you agree to our terms of services & Privacy Policy
          </CustomText>
        </View> */}
      </View>
    </GestureHandlerRootView>
  )
}

export default CustomerLogin

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  subContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 40
  },
   footer: {
    borderTopWidth: 0.8,
    borderColor: Colors.border,
    paddingBottom: 10,
    zIndex: 22,
    position: 'absolute',
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f8f9fc",
    width: "100%"
   },
  gradient : {
    paddingTop : 60,
    width : "100%"
  },
  content : {
    justifyContent : "center",
    alignItems : "center",
    width : '100%',
    backgroundColor : "white",
    paddingHorizontal : 20,
    paddingBottom : 80
  },
  logo : {
    height : 50,
    width : 50,
    borderRadius : 20,
    marginVertical : 10
  },
  text : {
    marginTop : 2,
    marginBottom : 10,
    opacity : 0.8
  },
  phoneText : {
    marginLeft : 10
  }
})
