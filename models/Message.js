const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required!'],
      index: true,
    },
    recieverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Reciever is required!'],
    },
    title: {
      type: String,
      trim: true,
      min: [5, 'Title must be at least 5 characters!'],
      required: [true, 'Title is required!'],
    },
    body: {
      type: String,
      trim: true,
      min: [20, 'Body must be at least 20 characters!'],
      required: [true, 'Body is required!'],
    },
  },
  { timestamps: true }
);

messageSchema.index({ title: 'text' });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
