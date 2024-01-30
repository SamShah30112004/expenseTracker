const mongoose = require('mongoose')
const URL = "mongodb://127.0.0.1:27017/expenseTracker";

const connectToMongo = async () => {
    await mongoose.connect(URL);
    console.log("Connected Successfully");
}

module.exports = connectToMongo