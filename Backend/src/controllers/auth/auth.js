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
