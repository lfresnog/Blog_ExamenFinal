import * as uuid from 'uuid';

const Mutation = {
    signUp: async (parent, args, ctx, info) => {
        const {client} = ctx;
        const {mail,pwd,author} = args;
        
        const db = client.db("examenFinal");
        const usersCollection = db.collection("users");

        const finded = await usersCollection.findOne({mail});
        if(finded) throw new Error("Mail already use");
        const inserted = await usersCollection.insertOne({mail,pwd,author,token:undefined});

        return inserted.ops[0];
    },
    logIn: async (parent, args, ctx, info) => {
        const {client} = ctx;
        const {mail,pwd} = args;
        
        const db = client.db("examenFinal");
        const usersCollection = db.collection("users");

        const updated = await usersCollection.findOneAndUpdate(
            {mail,pwd},
            {$set:{token:uuid.v1()}},
            {returnOriginal: false}
        );
        if(!updated.value) throw new Error("Invalid Mail/Password");

        setTimeout( () => {
            usersCollection.updateOne({name}, {$set: {token:undefined}});
        }, 1800000)

        return updated.value;
    },
    logOut: async (parent, args, ctx, info) => {
        const {client} = ctx;
        const {mail,token} = args;
        
        const db = client.db("examenFinal");
        const usersCollection = db.collection("users");

        const updated = await usersCollection.findOneAndUpdate(
            {mail,token},
            {$set:{token:undefined}},
            {returnOriginal: false}
        );
        if(!updated.value) throw new Error("Invalid Mail/Token");

        return updated.value;
    },
    removeUser: async (parent, args, ctx, info) => {
        const {client} = ctx;
        const {mail,pwd,token} = args;
        
        const db = client.db("examenFinal");
        const usersCollection = db.collection("users");
        const publicationsCollection = db.collection("publications");

        const deleted = await usersCollection.findOneAndDelete({mail,pwd,token});
        if(!deleted.value) throw new Error("Invalid Mail/Pwd/Token");

        if(deleted.value.author == true)
            await publicationsCollection.deleteMany({author:mail});
        
        return deleted.value;
    },
    readAll: async (parent, args, ctx, info) => {
        const {client} = ctx;
        const {mail,token} = args;
        
        const db = client.db("examenFinal");
        const usersCollection = db.collection("users");
        const publicationsCollection = db.collection("publications");

        const userFounded = await usersCollection.findOne({mail,token});
        if(!userFounded) throw new Error("Invalid Mail/Token");

        const finded = await publicationsCollection.find({}).toArray();

        return finded;
    },
    readAuthor: async (parent, args, ctx, info) => {
        const {client} = ctx;
        const {mail,token,author} = args;
        
        const db = client.db("examenFinal");
        const usersCollection = db.collection("users");
        const publicationsCollection = db.collection("publications");

        const userFounded = await usersCollection.findOne({mail,token});
        if(!userFounded) throw new Error("Invalid Mail/Token");

        const finded = await publicationsCollection.find({author}).toArray();

        return finded;
    },
    readPublication: async (parent, args, ctx, info) => {
        const {client} = ctx;
        const {mail,token,title} = args;
        
        const db = client.db("examenFinal");
        const usersCollection = db.collection("users");
        const publicationsCollection = db.collection("publications");

        const userFounded = await usersCollection.findOne({mail,token});
        if(!userFounded) throw new Error("Invalid Mail/Token");

        const finded = await publicationsCollection.find({title}).toArray();

        return finded;
    },
    addPublication: async (parent, args, ctx, info) => {
        const {client,pubsub} = ctx;
        const {mail,token,title,description} = args;
        
        const db = client.db("examenFinal");
        const usersCollection = db.collection("users");
        const publicationsCollection = db.collection("publications");

        const userFinded = await usersCollection.findOne({mail,token});
        if(!userFinded) throw new Error("Mail/Token incorrect");
        if(userFinded.author == false) throw new Error("This user is not an author");

        const publicationFounded = await publicationsCollection.findOne({title});
        if(publicationFounded) throw new Error("Title already use");

        const inserted = await publicationsCollection.insertOne({title,description,author:mail});

        pubsub.publish(mail,{tellMe: `${mail} has a new publication`});

        return inserted.ops[0];        
    },
    removePublication: async (parent, args, ctx, info) => {
        const {client} = ctx;
        const {mail,token,title} = args;
        
        const db = client.db("examenFinal");
        const usersCollection = db.collection("users");
        const publicationsCollection = db.collection("publications");

        const userFinded = await usersCollection.findOne({mail,token});
        if(!userFinded) throw new Error("Invalid Mail/Token");
        if(userFinded.author == false) throw new Error("This user is not an author");

        const deleted = await publicationsCollection.findOneAndDelete({title,author:mail});
        if(!deleted.value) throw new Error("Invalid Title/User");

        return deleted.value;
    }
}

export {Mutation as default};