import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { FC } from 'react'
import { Colors, Fonts } from '@utils/Constants';
import CustomText from './CustomText';

interface CustomButtonProps {
    onPress:()=>void;
    title : string,
    disabled : boolean,
    loading : boolean
}

const CustomButton:FC<CustomButtonProps> = ({onPress, title, loading, disabled}) => {
  return (
   <TouchableOpacity
   onPress={onPress}
   disabled = {disabled}
   activeOpacity={0.8}
        style = {[styles.btn, {
            backgroundColor :disabled ? Colors.disabled : Colors.secondary
        }]}
   >{
    loading ? 
    <ActivityIndicator color= "#fff" size= "small"/>:
    <CustomText style={styles.text} variant='h6' fontFamily={Fonts.SemiBold}>
    {title}
    </CustomText>
   }
     
   </TouchableOpacity>
  )
}
const styles = StyleSheet.create({

    btn : {
        justifyContent : "center",
        alignItems : "center",
        borderRadius : 10,
        padding : 15,
        marginVertical : 15,
        width : "100%"
    },
    text : {
        color : "#fff"
    }
})

export default CustomButton

