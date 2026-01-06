

// FLow -> createOrder-> confirmOrder->updateOrder->getOrders/getOrder by id

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

export  const updateOrderStatus = async(req, reply)=> {
    try {
         const {orderId} = req.params;
         const {status, deliveryPersonLocation} = req.body;
         const {userId} = req.user;

         const deliveryPerson = await DeliveryPartner.findById(userId);

         if(!deliveryPerson) {
            return reply.status(404).send({message : "Delivery Person not found"});
         }

         const order = await Order.findById(orderId);
         if(!order) return reply.status(404).send({message : "Order not found"})
        
        if(["cancelled", "delivered"].includes(order.status)){
            return reply.status(400).send({message : "Order cannot be updated"});
        }
           
        // jo delivery partner assign hua hai wohi update kr skta hai

        if(order.deliveryPartner.toString() !== userId){
            return reply.status(403).send({message : "Unauthorized"})
        }

        order.status = status,
        order.deliveryPersonLocation = deliveryPersonLocation;
        await order.save();

        req.server.io.to(orderId).emit("liveTrackingUpdates", order);

         return reply.send(order)

    } catch (error) {
        return reply.status(500).send({message : "Failed to update order status", error});
    }
}



export const getOrders = async(req, reply)=> {
   try {
    // exampke GET /orders?status=confirmed&branchId=66ab1&customerId=77xy9
    // GET /orders?status=available → req.query.status
     const {status, customerId, deliveryPartnerId , branchId} = req.query;
     let query = {};

     if(status){
        query.status = status;
     }

     if(customerId){
        customerId.status = customerId;
     }
     if(deliveryPartnerId){
        query.deliveryPartner = deliveryPartnerId;
        query.branch = branchId
     }

     const orders = await Order.find(query).populate(
        "customer branch items.item deliveryPartner"
     );

     return reply.send(orders)
   } catch (error) {
    return reply.status(500).send({message : "Failed to retrieve orders", error})
    
   }
};

export const getOrderById = async()=> {
    try {
        const {orderId} = req.params;

        const order = await Order.findById(orderId).populate(
            "Customer branch items.item deliveryPartner"
        );

        if(!order){
            return reply.status(404).send({messge : "Order not found"})
        }
        return reply.send(order)
    } catch (error) {
        return reply.status(500).send({message : "Failed to retrive order", error})
    }
}