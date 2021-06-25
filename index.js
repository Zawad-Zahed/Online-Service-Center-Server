const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");
const cors = require("cors");
const bodyParser = require("body-parser");
const ObjectID = require("mongodb").ObjectID;
require("dotenv").config();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Welcome To Online Service Center");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kjs3d.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  const serviceCollection = client.db("CholoHatBarai").collection("Services");
  const adminCollection = client.db("CholoHatBarai").collection("admin");
  const orderCollection = client.db("CholoHatBarai").collection("order");
  const reviewCollection = client.db("CholoHatBarai").collection("review");
  // perform actions on the collection object

  app.post("/update/:id", (req, res) => {
    const id = ObjectID(req.params.id);
    const data = req.body;
    orderCollection
      .findOneAndUpdate({ _id: id }, { $set: { status: data.status } })
      .then((result) => {
        console.log(result);
        res.send(result);
      })
      .catch((err) => {
        console.log(err);
      });
  });
  app.post("/isAdmin", (req, res) => {
    // console.log(req.body.email);
    adminCollection.find({ email: req.body.email }).toArray((err, admins) => {
      res.send(admins.length > 0);
    });
  });
  app.get("/admin", (req, res) => {
    // console.log('from query ',req.query.email);
    adminCollection.find({ email: req.query.email }).toArray((err, admin) => {
      res.send(admin);
      console.log(err, admin);
    });
  });
  app.post("/addAdmin", (req, res) => {
    newAdmin = req.body;
    console.log(newAdmin);
    adminCollection.insertOne(newAdmin).then((result) => {
      console.log("inserted count", result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });
  app.get("/reviews", (req, res) => {
    reviewCollection.find().toArray((err, items) => {
      res.send(items);
      console.log("Review from database", items);
    });
  });
  app.post("/addReview", (req, res) => {
    const newReview = req.body;
    console.log("Review here ", newReview);
    reviewCollection.insertOne(newReview).then((result) => {
      console.log("inserted count", result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });
  app.post("/addOrder", (req, res) => {
    const newOrder = req.body;
    orderCollection.insertOne(newOrder).then((result) => {
      res.send(result.insertedCount > 0);
    });
    console.log("newOrder", newOrder);
  });

  app.get("/orders", (req, res) => {
    // console.log(req.query.email);
    orderCollection
      .find({ email: req.query.email })
      //  orderCollection.find()
      .toArray((err, documents) => {
        res.send(documents);
      });
  });

  app.get("/allOrder", (req, res) => {
    orderCollection.find().toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get("/services", (req, res) => {
    serviceCollection.find().toArray((err, services) => {
      res.send(services);
      console.log("service from database", services);
    });
  });

  app.post("/addService", (req, res) => {
    const newService = req.body;
    console.log("hello service", newService);
    serviceCollection.insertOne(newService).then((result) => {
      console.log("inserted count", result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });

  app.delete("/deleteService/:id", (req, res) => {
    const id = ObjectID(req.params.id);
    console.log(id);
    serviceCollection.findOneAndDelete({ _id: id }).then((documents) => {
      console.log("documents deleted", documents);
      res.send(!!documents.value);
    });
  });
  // client.close()
});

app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening at ${port}`);
});
