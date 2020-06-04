const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');

const CustomError = require('../helpers/customError');
const asyncRouterWrapper = require('../helpers/helper');
const checkValidationErrors = require('../helpers/checkValidation');
const authUser = require('../middlewares/auth');
const checkMessageOwner = require('../middlewares/authMessageOwner');

//Get received messages

router.get(
  '/received',
  authUser,
  asyncRouterWrapper(async (req, res, next) => {
    const messages = await Message.find({ recieverId: req.user._id })
      .populate({ path: 'authorId', select: 'firstName lastName email' })
      .sort({ createdAt: -1 });
    res.json(messages);
  })
);

router.get(
  '/sent',
  authUser,
  asyncRouterWrapper(async (req, res, next) => {
    const messages = await Message.find({ authorId: req.user._id })
      .populate({ path: 'authorId', select: 'firstName lastName email' })
      .sort({ createdAt: -1 });
    res.json(messages);
  })
);
//Add Message
router.post(
  '/',
  authUser,
  asyncRouterWrapper(async (req, res, next) => {
    req.body.authorId = req.user._id;
    console.log('body', req.body);

    const { title, body, email } = req.body;

    const result = await User.findOne({ email });
    console.log(result);
    if (result != null) {
      const message = new Message({
        authorId: req.user._id,
        recieverId: result._id,
        title,
        body,
      });
      const populatedMessage = await Message.populate(message, {
        path: 'authorId',
        select: 'firstName lastName email',
      });
      const addedMessage = await populatedMessage.save();
      console.log(addedMessage);
      res
        .status(200)
        .send({ message: 'Added Succ', messageSent: addedMessage });
    } else {
      res.status(404).send({ message: 'User not found!' });
    }
  })
);

//Update Blog
router.patch(
  '/:id',
  authUser,
  checkMessageOwner,
  asyncRouterWrapper(async (req, res, next) => {
    delete req.body.createdAt;
    delete req.body.updatedAt;
    delete req.body.__V;
    console.log(req.body);
    const updatedMessage = await Message.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        strict: 'throw',
      }
    );
    if (!updatedMessage) throw new CustomError('Message Not Found!', 404);
    res.send({
      message: 'Message Updated Succ',
      messageUpdated: updatedMessage,
    });
  })
);

//Delete Message
router.delete(
  '/:id',
  authUser,
  asyncRouterWrapper(async (req, res, next) => {
    const deletedMessage = await Message.findByIdAndRemove(req.params.id);
    if (!deletedMessage) throw new CustomError('Message Not Found!', 404);
    res.send({ message: 'Deleted Succ' });
  })
);

module.exports = router;
