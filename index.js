const express = require("express");
require("dotenv").config(); // environment variables
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.2pvxk.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();
const port = precess.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

client.connect((err) => {
  const appointmentsCollection = client
    .db("doctorsPortal")
    .collection("appointments");

  app.post("/addAppointment", (req, res) => {
    const appointment = req.body;
    console.log(appointment);
    appointmentsCollection.insertOne(appointment).then((result) => {
      res.send(result.acknowledged);
    });
  });

  app.get("/getAllAppointments", (req, res) => {
    appointmentsCollection.find().toArray((error, result) => {
      res.send(result);
    });
  });

  app.delete("/deleteAppointment/:id", (req, res) => {
    const id = req.params.id;

    appointmentsCollection
      .deleteOne({ _id: ObjectId(`${id}`) })
      .then((result) => {
        // console.log(result.deletedCount > 0);
        res.send(result.deletedCount > 0);
      });
  });
});

app.listen(port, () => {
  console.log(`Example app listening at Port ${port}`);
});
