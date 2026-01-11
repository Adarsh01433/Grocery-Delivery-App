import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import React, { FC } from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors, Fonts } from '@utils/Constants';

interface InputProps {
    left : React.ReactNode;
    onClear?:()=>void;
    right?: boolean
}

const CustomInput:FC<InputProps & React.ComponentProps <typeof TextInput>> = ({left, right, onClear, ...props}) => {
  return (
    <View style = {styles.flexRow}>
        {left}
        <TextInput 
        {...props}
        style = {styles.inputContainer}
        placeholderTextColor= "#ccc"
        />
        <View style = {styles.icon}>
          {props?.value?.length !=0 && right &&
          <TouchableOpacity onPress={onClear}>
           <Icon name = "close-circle-sharp" size = {RFValue(16)} color= "#ccc"/>
          </TouchableOpacity> 
          }
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    icon : {
        width : '5%',
        justifyContent : "center",
        alignItems : "center",
        marginRight : 10
    },
    inputContainer : {
        width : '70%',
        fontFamily : Fonts.SemiBold,
        fontSize : RFValue(12),
        paddingVertical : 14,
        paddingBottom : 15,
        height : '100%',
        color : Colors.text,
        bottom : -1
    },
    text : {
        width : "10%",
        marginLeft : 10,
    },
    flexRow : {
        flexDirection : "row",
        alignItems :"center",
        justifyContent : "space-between",
        borderRadius : 10,
        borderWidth :0.5,
        width : "100%",
        marginVertical : 10,
        backgroundColor : "#fff",
        shadowOffset: {width : 1, height :1},
        shadowOpacity : 0.6,
        shadowRadius : 2,
        shadowColor : Colors.border,
        borderColor : Colors.border,
    }
})


export default CustomInput