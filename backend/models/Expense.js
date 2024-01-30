const mongoose = require('mongoose');
const { Schema, ObjectId } = mongoose;

const ExpenseSchema = new Schema({
    user: { type: ObjectId, ref: 'User' }, 
    description: String,
    amount: Number,
    tags: String,
    date: Date,
    splitWith: [{ type: ObjectId, ref: 'User' }],
  });

module.exports = mongoose.model('expense', ExpenseSchema);