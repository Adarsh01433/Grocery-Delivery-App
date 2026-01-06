import {Customer, DeliveryPartner} from "../../models/index.js"

export const updateUser = async(req, reply)=> {
    try {
        const {userId} = req.user;
        const updateData = req.body

        let user = await Customer.findById(userId) || await DeliveryPartner.findById(userId)

        if(!user){
            return reply.status(404).send({message : "User not found"})
        }

        let userModel;
      
        if(user.role === "Customer"){
            userModel = Customer;
        }else if (user.role === "DeliveryPartner"){
            userModel = DeliveryPartner;
        } else {
            return reply.status(404).send({message : "Invalid user role"})
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            {$set : updateData},
            {new : true , runValidators : true}
        );
       
        if(!updatedUser){
            return reply.status(404).send({message : "User not found"})
        }

        return reply.send({
            message : "User Updated sucessfully",
            user : updatedUser
        })
        
    } catch (error) {
        return reply.status(500).send({message : "Failed to update user", error})
    }
}