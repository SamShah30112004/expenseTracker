const mongoose = require('mongoose');
const { Schema, ObjectId } = mongoose;

const DebtSchema = new Schema({
  debtors: [
    {
      user: { type: ObjectId, ref: 'User' },
      amount: Number,
      settled: Boolean,
    },
  ],
  creditor: { type: ObjectId, ref: 'User' },
});

module.exports = mongoose.model('debt', DebtSchema);
