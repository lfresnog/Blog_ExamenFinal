const Subscription = {
    tellMe: {
        subscribe: async (parent, args, ctx, info)=>{
            const {mail,token,author} = args;
            const {client,pubsub} = ctx;

            const db = client.db("examenFinal");
            const usersCollection = db.collection("users");

            const userFinded = await usersCollection.findOne({mail,token});
            if(!userFinded) throw new Error("Mail/Token incorrect");

            const authorFinded = await usersCollection.findOne({mail:author,author:true});
            if(!authorFinded) throw new Error("Author incorrect");
            
            return pubsub.asyncIterator(author);
        }
    }
};

export {Subscription as default};