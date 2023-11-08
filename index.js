const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())

// mongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.c6bvskv.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // await client.connect();

    const serviceCollection = client.db('serviceDB').collection('service');

    // read data
    app.get("/dashboard/AddService", async (req, res) => {
      const cursor = serviceCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    // Create Product data
    app.post("/dashboard/AddService", async (req, res) => {
      const service = req.body;
      console.log(service);
      const result = await serviceCollection.insertOne(service)
      res.send(result)
    })

    app.get('/dashboard/AddServices/:id', async (req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await serviceCollection.findOne(query)
      res.send(result)
    })

    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

// testing
app.get('/', (req, res) => {
  res.send('Server is running')
})

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
})