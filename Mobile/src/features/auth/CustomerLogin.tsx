import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {GestureHandlerRootView , PanGestureHandler, State} from "react-native-gesture-handler"
import CustomSafeAreaView from '@components/global/CustomSafeAreaView'
import ProductSlider from '@components/login/ProductSlider'

const CustomerLogin = () => {
  return (
   <GestureHandlerRootView>
    <View style = {styles.container}>
      <CustomSafeAreaView>
        <ProductSlider/>
      </CustomSafeAreaView>
    </View>
   </GestureHandlerRootView>
  ) 
}

export default  CustomerLogin

const styles = StyleSheet.create({
       container : {
        flex : 1
       }
})
