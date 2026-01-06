export const updateUser = async(req, reply)=> {
    try {
        
    } catch (error) {
        return reply.status(500).send({message : "Failed to update user", error})
    }
}