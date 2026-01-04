import {Customer, Customer, DeliveryPartner} from "../../models/user.js"
import jwt from 'jsonwebtoken'

 // token generate utility
const generateTokens = (user)=> {
   const accessToken = jwt.sign(
    {userId : user._id , role : user.role},// payload-> Payload encrypted nahi hota
    process.env.ACCESS_TOKEN_SECRET, // signatute
    {expiresIn : "1d"}// options
   )
     
   const refreshToken = jwt.sign(
    {userId : user._id, role : user.role},
    process.env.REFRESH_TOKEN_SECRET,
    {expiresIn : '7d'}
   )
      return {accessToken, refreshToken}
}

export const loginCustomer = async(req,reply)=> {
    try {
        const {phone} = req.body;
        let customer = await Customer.findOne({phone});

        if(!customer){
            customer = new Customer({
                phone,
                role : "Customer",
                isActivated : true
            })
            await customer.save()
        }

        const {accessToken, refreshToken} = generateTokens(customer)
        return reply.send({
            message : 'Login Sucessfull',
            accessToken,
            refreshToken,
            customer
        })
        
    } catch (error) {
        return reply.status(500).send({message : "Error occured in loginCustomer controller ", error});
        
    }
}

export const loginDeliveryPartner = async(req, reply)=> {
  try {
    const { email, password} = req.body;
    const deliveryPartner = await DeliveryPartner.findOne({email});
    
    if(!deliveryPartner){
        return reply.status(404).send({message : "Delivery Patner not found"})
    }

    const isMatch = password === deliveryPartner.password;
    if(isMatch){
        return reply.status(400).send({message : "Invalid credentials"});
    }

    const {accessToken, refreshToken} = generateTokens(deliveryPartner);
    return reply.send({
        message : "Login SucessFul",
        accessToken,
        refreshToken,
        deliveryPartner
    })
     
    
  } catch (error) {
    return reply.status(500).send({message : "An error occured", error})
    
  }
}
// generateTokens() = token banana
// refreshToken() controller = expired access token ke baad NAYA access token banana
// Ye sirf access token renew karta hai
export const refreshToken = async(req, reply)=> {
      const {refreshToken} = req.body;

      if(!refreshToken){
        return reply.status(401).send({message : "Refresh Token required"})
      }
      try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
         // decoded me sirf wahi cheezein aati hain jo tune token ke payload me daali hoti hain +

           // Isme:
  // for let user
// ❌ password nahi
// ❌ phone/email nahi
// ❌ isActivated nahi
// ❌ refreshToken nahi
// Matlab ye real user nahi hai, sirf ek claim hai.
// Isliye:
// 👉 DB se actual user lana padta hai
// 👉 us user ko ek variable me rakhna padta hai
// 👉 wahi variable hai user

        let user;
        if(decoded.role === "Customer") {
            user = await Customer.findById(decoded.userId);
        } else if (decoded.role === "DeliveryPartner"){
            user = await DeliveryPartner.findById(decoded.userId);
        } else {
            return reply.status(403).send({message : "Invalid Role"})
        }

        if(!user){
            return reply.status(403).send({message : "User not found"});
        }

        const {accessToken, refreshToken: newRefreshToken} = generateTokens(user);

        return reply.send({
            message : "Token Refreshed",
            accessToken,
            refreshToken : newRefreshToken
        })
        
      } catch (error) {
         return reply.status(403).send({message : "Invalid Refresh Token"})
      }
} 