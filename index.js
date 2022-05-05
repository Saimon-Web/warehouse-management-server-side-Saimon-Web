const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
const jwt = require('jsonwebtoken');




// function verifyjwt
//MIDDLE WARE
app.use(cors());
app.use(express.json());

//mongodb connected

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ijlek.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
  try {
    await client.connect();
    const storeCollection = client.db('Car-delarship-project').collection('store');


    //login  time  jwt token create
    app.post('/login', async (req, res) => {
      const user = req.body;
      const accessToken = jwt.sign(user, process.env.ACCESS_SECRET_TOKEN, {
        expiresIn: '1d'
      })
      res.send({ accessToken });
    })




    //api all inventory
    app.get('/inventory', async (req, res) => {
      const query = {};
      const cursor = storeCollection.find(query);
      const stores = await cursor.toArray();
      res.send(stores);
    })

    //single data

    app.get('/inventory/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const inventory = await storeCollection.findOne(query);
      res.send(inventory);
    })
    // adding item
    app.post('/inventory', async (req, res) => {
      const newInventory = req.body;
      const result = await storeCollection.insertOne(newInventory);
      res.send(result)
    })

    //delete item
    app.delete('/inventory/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) }
      const result = await storeCollection.deleteOne(query)
      res.send(result)
    })

    //update user
    app.put('/inventory/:id', async (req, res) => {
      const id = req.params.id;
      const updatedInventory = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          qunatity: updatedInventory.qunatity
        },
      };

      const result = await storeCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    })




    //verify jwt
    function verifyjwt(req, res, next) {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).send({ message: 'unauthorized access' })
      }
      const token = authHeader.split(' ')[1];
      jwt.verify(token, process.env.ACCESS_SECRET_TOKEN, (err, decoded) => {
        if (err) {
          return res.status(403).send({ message: 'Forbidden access' })
        }
        console.log(decoded)
        req.decoded = decoded;
        next();
      })

     
    }



    //my item api loaded and query email
    app.get('/mypath', verifyjwt, async (req, res) => {
      const decodedEmail = req.decoded.email;
      const email = req.query.email;
     if(email === decodedEmail){
      const query = { email: email };
      const cursor = storeCollection.find(query);
      const myInventory = await cursor.toArray();
      res.send(myInventory);
     }

    })



  }
  finally {

  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
