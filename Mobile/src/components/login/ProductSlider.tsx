import { StyleSheet, Text, View } from 'react-native'
import React, { useMemo } from 'react'
import { imageData } from '@utils/dummyData'

const ProductSlider = () => {

  const rows = useMemo(()=> {
  const result = []
  for(let i =0; i<imageData.length; i+=4){
    result.push(imageData.slice(i,i+4))
  }
  return result;
  },[])

  return (
    // koi touch nhi
    <View pointerEvents='none'>  
      <Text>ProductSlider</Text>
    </View>
  )
}

export default ProductSlider

const styles = StyleSheet.create({

})