
const express = require('express')
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;



app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://jewelmia2330:phSpkcERXjg924wU@cluster0.jc0qojg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const database = client.db("tourism-Management");
    const userCollection= database.collection("user");


    const databaseTwo = client.db("Country-Information");
    const countryCollection= databaseTwo.collection("countries");



    app.post("/countries", async(req, res)=>{
      const product = req.body;
      console.log(product);
      const result = await countryCollection.insertOne(product);
      res.send(result)
    })


    app.get("/countries", async(req, res)=>{
      const cursor = countryCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    app.get("/countries/:email", async (req, res) => {
      console.log(req.params.email)
      const result = await countryCollection.find({email: req.params.email}).toArray();
      res.send(result);
    });

    app.delete("/countries/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id)
      const query = { _id: new ObjectId(id) };
      const result = await countryCollection.deleteOne(query);
      res.send(result);
    });
    app.put("/countries/:id", async(req, res)=>{
      const id = req.params.id
      const filter= { _id: new ObjectId(id)}
      const options = {upsert: true};
      const updateData = req.body;
      const updateCountries ={
        $set:{
          name:updateData.name,
          userEmail:updateData.userEmail,
          photoURL:updateData.photoURL,
          spot_name:updateData.spot_name,
          country_name:res.country_name,
          price:updateData.price,
          season:updateData.season,
          travelTime:updateData.travelTime,
          visitor:updateData.visitor,
          description:updateData.description,
        }
      }
      const result = await countryCollection.updateOne(filter, updateCountries, options);
      console.log(result)
      res.send(result)
    })


    app.get("/products", async(req, res)=>{
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})
