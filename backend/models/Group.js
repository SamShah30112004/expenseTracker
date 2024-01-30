const mongoose = require('mongoose');
const { Schema, ObjectId } = mongoose;

const GroupSchema = new Schema({
  name: String,
  members: [{ type: ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('group', GroupSchema);