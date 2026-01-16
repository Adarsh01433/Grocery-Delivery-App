import axios from "axios"
import { BASE_URL } from "./config"
import {tokenStorage} from '@state/storage'
import { useAuthStore } from "@state/authStore"


// 🔥 ADD THIS LINE EXACTLY HERE
console.log("🔥 authService FILE LOADED")
  



export const customerLogin = async(phone : string)=> {
     console.log("📤 customerLogin CALLED with:", phone);
   
    try {
         console.log("📤 Sending phone to backend:", phone)
         const response =  await axios.post(`${BASE_URL}/customer/login`, {phone})

          console.log("✅ RAW RESPONSE:", response)
    console.log("✅ RESPONSE DATA:", response.data)
         const {accessToken, refreshToken, customer} = response.data
         tokenStorage.set("accessToken", accessToken)
         tokenStorage.set("refreshToken", refreshToken)
        
          const {setUser} = useAuthStore.getState()
          setUser(customer)
         
    } catch (error:any) {
        console.log("❌ LOGIN ERROR STATUS:", error.response?.status)
    console.log("❌ LOGIN ERROR DATA:", error.response?.data)
    console.log("❌ LOGIN ERROR MESSAGE:", error.message)
    throw error
    }
}

export const deliveryLogin = async(email:string , password:string)=> {
     console.log("📤 DeliveryLogin CALLED with:", email, password);

     try {
         const response = await axios.post(`${BASE_URL}/delivery/login`,{email, password})
         const {accessToken, refreshToken, deliveryPartner} = response.data;
         tokenStorage.set('accesToken', accessToken)
         tokenStorage.set('refreshToken', refreshToken);
         const {setUser} = useAuthStore.getState();
         setUser(deliveryPartner)


     } catch (error: any) {
        console.log("❌ LOGIN ERROR STATUS:", error.response?.status)
    console.log("❌ LOGIN ERROR DATA:", error.response?.data)
    console.log("❌ LOGIN ERROR MESSAGE:", error.message)
    throw error
        
     }
}


export const refresh_token = async()=> {
    try {
        const refreshToken = tokenStorage.getString('refreshToken')
        const response = await axios.post(`${BASE_URL}/refresh-token`, {
            refreshToken
        })
            const new_access_token = 

    } catch (error) {
        
    }
}