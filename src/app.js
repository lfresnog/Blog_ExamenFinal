import {GraphQLServer, PubSub} from 'graphql-yoga'
import {MongoClient} from 'mongodb';
import 'babel-polyfill';
import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import Publication from './resolvers/Publication'
import Subscription from './resolvers/Subscription'

/**
 * Connects to MongoDB Server and returns connected client
 * @param {string} usr MongoDB Server user
 * @param {string} pwd MongoDB Server pwd
 * @param {string} url MongoDB Server url
 */

const connectToDb = async function(usr, pwd, url) {
    const uri = `mongodb+srv://${usr}:${pwd}@${url}`;
    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    await client.connect();
    return client;
  };

const startGraphql = (client) => {
    const resolvers = {
        Query,
        Mutation,
        Publication,
        Subscription
    }
    const pubsub = new PubSub();
    const context = {client,pubsub};
    const server = new GraphQLServer({typeDefs: './src/schema.graphql', resolvers, context});
    const options = {port:4004};
    server.start(options,(port) => console.log("I am ready....."));
}  


const runApp = async() =>{
    const usr = "lfresnog";
    const pwd = "123456abc";
    const url = "miprimercluster-hjfah.gcp.mongodb.net/test?retryWrites=true&w=majority";
    try{
        const client = await connectToDb(usr, pwd, url);
        startGraphql(client);
    }catch(e){
        console.log(e);  
        client.close();
    }
}
runApp();