import express from 'express'
//Allow express to understand graphql
import expressGraphql from 'express-graphql'
import connectDB from './config/db.js'
import schema from './schema/schema.js'
import dotenv from 'dotenv'
import cors from 'cors';

dotenv.config()

const app = express()

//Allow us cross origin request
app.use(cors());


const {graphqlHTTP} = expressGraphql;

connectDB()
//Middlewares
app.use('/graphql', graphqlHTTP({
    schema,
    //Give us the graphical tool
    graphiql: true
}))

app.listen(5000, ()=>console.log(`Servidor en puerto 5000`))