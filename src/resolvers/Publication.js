const Publication = {
    author: async (parent, args, ctx, info) => {
        const {client} = ctx;
        const {author} = parent;

        const db = client.db("examenFinal");
        const usersCollection = db.collection("users");

        const userFounded = await usersCollection.findOne({mail:author});
        if(!userFounded) throw new Error("Unexpected error");

        return userFounded;
    } 
}

export {Publication as default};
