const express = require('express');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rjsz0.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const port = 5000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());


client.connect(err => {
  const productCollection = client.db("emaJhonStore").collection("products");
  const orderCollection = client.db("emaJhonStore").collection("orders");
  console.log("Database Connected");

  app.post('/addProduct', (req,res) => {
      const product = req.body;
      console.log(product);
    productCollection.insertOne(product)
        .then(result => {
            console.log(result.insertedCount);
            res.send(result.insertedCount);
        })
  });

  app.get('/products', (req,res) => {
      productCollection.find({}).limit(20)
        .toArray((err, documents) => {
            res.send(documents);
        })
  });

  app.get('/product/:key', (req,res) => {
    productCollection.find({key: req.params.key})
      .toArray((err, documents) => {
          res.send(documents[0]);
      });
});

app.post('/productsByKeys', (req,res) => {
    const productKeys = req.body;
    productCollection.find({key: {$in: productKeys}})
        .toArray((error, documents) => {
            res.send(documents)
        });
});

app.post('/addOrder', (req,res) => {
    const order = req.body;
  orderCollection.insertOne(order)
      .then(result => {
          console.log(result.insertedCount);
          res.send(result.insertedCount > 0);
      })
});


});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port)