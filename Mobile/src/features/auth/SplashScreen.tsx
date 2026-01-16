import { Image, StyleSheet, Text, View } from 'react-native'
import React, { FC, useEffect } from 'react'
import { Colors } from '@utils/Constants'
import Logo from "@assets/images/logo.jpeg"
import { screenHeight, screenWidth } from '@utils/Scaling'
import { navigate, resetAndNavigate } from '@utils/NavigationUtils'
import GeoLocation from "@react-native-community/geolocation"
import { useAuthStore } from '@state/authStore'
import { tokenStorage } from '@state/storage'
import {jwtDecode} from "jwt-decode"



GeoLocation.setRNConfiguration({
  skipPermissionRequests: false,
  authorizationLevel : 'always',
  enableBackgroundLocationUpdates : true,
  locationProvider : 'auto'
})

interface DecodedToken {
  exp : number
}


const SplashScreen:FC = () => {
  const {user, setUser} = useAuthStore()

  const tokenCheck = async()=> {
    const accessToken = tokenStorage.getString('accessToken') as string
    const refreshToken = tokenStorage.getString('refreshToken') as string

     if(accessToken){
       
      const decodedAccessToken = jwtDecode<DecodedToken>(accessToken)
      const decodedRefreshToken = jwtDecode<DecodedToken>(refreshToken)

      const currentTime = Date.now() / 1000;

      

     }
     resetAndNavigate("CustomerLogin")
     return false 
  }

   useEffect(()=> {
    
    const navigateUser = async()=> {
      try {
         navigate("CustomerLogin")
      } catch (error) {
        
      }}
    const timeoutId = setTimeout(navigateUser,1000)
    return ()=>clearTimeout(timeoutId)
   },[])

  return (
    <View style = {styles.container}>
      <Image  style = {styles.logoImage}source={Logo}/>
    </View>
  )
}

export default SplashScreen

const styles = StyleSheet.create({
   container :{
    backgroundColor : Colors.primary,
    flex : 1,
    justifyContent : "center",
    alignItems : "center"
   },
   logoImage : {
    height : screenHeight * 0.7,
    width : screenWidth * 0.7,
    resizeMode : "contain"
   }
})