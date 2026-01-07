import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {GestureHandlerRootView , PanGestureHandler, State} from "react-native-gesture-handler"
import CustomSafeAreaView from '@components/global/CustomSafeAreaView'
import ProductSlider from '@components/login/ProductSlider'
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from '@utils/Constants'

const CustomerLogin = () => {
  return (
   <GestureHandlerRootView>
    <View style = {styles.container}>
      <CustomSafeAreaView>
        <ProductSlider/>
      </CustomSafeAreaView>

      <View style = {styles.footer}>
        <SafeAreaView />
      </View>
    </View>
   </GestureHandlerRootView>
  ) 
}

export default  CustomerLogin

const styles = StyleSheet.create({
       container : {
        flex : 1
       },
       footer : {
        borderTopWidth : 0.8,
        borderColor : Colors.border,
        paddingBottom : 10,
        zIndex : 22,
        position : 'absolute',
        bottom : 0,
        justifyContent : "center",
        alignItems : "center",
        padding : 10,
        backgroundColor : "#f8f9fc",
        width : "100%"
       }
})
