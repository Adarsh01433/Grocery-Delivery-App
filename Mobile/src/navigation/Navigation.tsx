import React, { FC } from 'react'
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {NavigationContainer} from '@react-navigation/native'
import { navigationRef } from '@utils/NavigationUtils';
import SplashScreen from '@features/auth/SplashScreen';
import DeliveryLogin from '@features/auth/DeliveryLogin';
import CustomerLogin from '@features/auth/CustomerLogin';
import ProductDashboard from '@features/dashboard/ProductDashboard';
import DeliveryDashboard from '@features/delivery/DeliveryDashboard';


const Stack = createNativeStackNavigator()

const Navigation:FC = () => {
  return (
    <NavigationContainer ref={navigationRef}>
        <Stack.Navigator initialRouteName='SplashScreen' screenOptions={{headerShown : false}}>
            <Stack.Screen name='SplashScreen' component={SplashScreen} options={{
              animation : "fade"
            }}/>

            <Stack.Screen name='ProductDashboard' component={ProductDashboard}/>
            <Stack.Screen name='DeliveryDashboard' component={DeliveryDashboard}/>
                
              <Stack.Screen name='DeliveryLogin' component={DeliveryLogin} options={{
                animation : "fade"
              }}/>

                <Stack.Screen name='CustomerLogin' component={CustomerLogin}/>
        </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Navigation