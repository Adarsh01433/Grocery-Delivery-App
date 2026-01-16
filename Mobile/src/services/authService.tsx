import axios from "axios"
import { BASE_URL } from "./config"
import {tokenStorage} from '@state/storage'
import { useAuthStore } from "@state/authStore"
import { resetAndNavigate } from "@utils/NavigationUtils"


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
         // 1️⃣ Local storage se refresh token uthao
        const refreshToken = tokenStorage.getString('refreshToken') 

        
    // 3️⃣ Backend ko refresh request bhejo
        const response = await axios.post(`${BASE_URL}/refresh-token`, {
            refreshToken
        })

         // 4️⃣ Server se naye tokens lo
            const new_access_token = response.data.accessToken
            const  new_refresh_token = response.data.refreshToken

            // 5️⃣ Tokens ko securely overwrite karo
            tokenStorage.set('accessToken', new_access_token)
            tokenStorage.set('refreshToken', new_refresh_token);
             return new_access_token

    } catch (error) {
        console.log("REFRESH TOKEN ERROR", error)
        tokenStorage.clearAll()
        resetAndNavigate("CustomerLogin")
        
        
    }
}

export const refetchUser = async(setUser : any)=> {
       try {
        const response = await appAxios.get('/user')
        setUser(response.data.user)
       } catch (error) {
        console.log("Login error", error);
        
       }
}