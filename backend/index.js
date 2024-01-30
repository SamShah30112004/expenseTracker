const express = require('express');
const connectToMongo = require('./db');
connectToMongo();
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/friends", require("./routes/friends"));
app.use("/api/expense", require("./routes/expense"));

app.listen(5000, () => {
  console.log('App listening on http://localhost:5000');
});
