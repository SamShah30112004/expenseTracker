const mongoose = require('mongoose');
const { Schema, ObjectId } = mongoose;

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique:true },
  password: { type: String, required: true },
  friends: [{ type: ObjectId, ref: 'User' }],
  groups: [{ type: ObjectId, ref: 'Group' }],
});

module.exports = mongoose.model('user', UserSchema);