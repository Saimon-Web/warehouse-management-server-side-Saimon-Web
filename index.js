const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT ||5000;
require('dotenv').config()

//MIDDLE WARE
app.use(cors());
app.use(express.json());

//mongodb connected

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ijlek.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{
        await client.connect();
        const storeCollection =client.db('Car-delarship-project').collection('store');
        app.get('/product',async(req,res)=> {
            const query={};
            const cursor=storeCollection.find(query);
            const stores=await cursor.toArray();
            res.send(stores);
        })

    }
    finally{

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
