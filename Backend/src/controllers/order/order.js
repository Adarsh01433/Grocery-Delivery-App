

// createOrder
import Order from "../../models/order.js"
import Branch from "../../models/branch.js"
import {Customer, DeliveryPartner} from "../../models/user.js"

export const createOrder = async (req, reply)=> {
    try {
        const {userId} = req.user;
        const {items, branch, totalPrice } = req.body;

        const customerData = await Customer.findById(userId)
        const branchData = await Branch.findById(branch)
        
        if(!customerData){
            return reply.status(404).send({message : "Customer not found"});
        }

        const newOrder = new Order({
            customer : userId,
            items : items.map((item)=> ({
                id : item.id,
                item : item.item,
                count : item.count,
            })),
            branch: branch,
            totalPrice,
            deliveryLocation: {
                latitude : customerData.liveLocation.latitude,
                longitude : customerData.liveLocation.longitude,
                address : customerData.address || "No address avilable",
            },
            pickupLocation : {
                latitude : branchData.location.latitude,
                longitude : branchData.location.longitude,
                address : branchData.address || "No address avilable"
            }
             
        });

        const savedOrder = await newOrder.save()
        return reply.status(201).send(savedOrder)

    } catch (error) {
        console.log(err);
        return reply.status(500).send({message : "Failed to crete order", error})
        
    }
}

export const confirmOrder = async(req, reply)=> {
    try {
        const {orderId} = req.params;
        const {userId} = req.user;
        const {deliveryPersonLocation} = req.body;

        const deliveryPerson = await DeliveryPartner.findById(userId);

        if(!deliveryPerson){
            return reply.status(404).send({message : "Delivery Person not found"});
        }
          // Order fetch
        const order = await Order.findById(orderId);
        
        if(!order) return reply.status(404).send({message : "Order not found"})

            if(order.status !== "available"){
                return reply.status(400).send({message : "Order is not avilable"})
            }

            order.status = "confirmed"

            //Assign delivery partner
            order.deliveryPartner = userId;

            // Save delivery person location snapshot
            order.deliveryPersonLocation = {
                latitude : deliveryPersonLocation?.latitude,
                longitude : deliveryPersonLocation?.longitude,
                address : deliveryPersonLocation.address || " "
            };

            req.server.io.to(orderId).emit('orderConfirmed', order)
            await order.save()

            return reply.send(order)

        
    } catch (error) {
        return reply.status(500).send({message : "Failed to confirm order", error})
    }
}