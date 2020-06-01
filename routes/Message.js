const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');

const CustomError = require('../helpers/customError');
const asyncRouterWrapper = require('../helpers/helper');
const checkValidationErrors = require('../helpers/checkValidation');
const authUser = require('../middlewares/auth');
const checkMessageOwner = require('../middlewares/authMessageOwner');

//Get Pages of Blogs for home page

// router.get(
//   '/pages/:pageNum',
//   asyncRouterWrapper(async (req, res, next) => {
//     const pageNum = req.params.pageNum;
//     console.log('pageNum', pageNum);
//     const pageSize = 4;
//     const blogsPromise = Blog.find({})
//       .populate({ path: 'authorId', select: 'firstName lastName' })
//       .sort({ createdAt: -1 })
//       .skip((pageNum - 1) * pageSize)
//       .limit(pageSize);
//     const countPromise = Blog.countDocuments();
//     const [blogs, count] = await Promise.all([blogsPromise, countPromise]);
//     const pagesCount = Math.ceil(count / pageSize);
//     res.json({ blogs, pagesCount });
//   })
// );

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
// router.patch(
//   '/:id',
//   authUser,
//   checkBlogOwner,
//   asyncRouterWrapper(async (req, res, next) => {
//     delete req.body.createdAt;
//     delete req.body.updatedAt;
//     delete req.body.__V;
//     console.log(req.body);
//     const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
//       strict: 'throw',
//     });
//     if (!updatedBlog) throw new CustomError('Blog Not Found!', 404);
//     res.send({ message: 'Blog Updated Succ', blog: updatedBlog });
//   })
// );

// //Delete Blog
// router.delete(
//   '/:id',
//   authUser,
//   checkBlogOwner,
//   asyncRouterWrapper(async (req, res, next) => {
//     const deletedBlog = await Blog.findByIdAndRemove(req.params.id);
//     if (!deletedBlog) throw new CustomError('Blog Not Found!', 404);
//     res.send({ message: 'Deleted Succ' });
//   })
// );

module.exports = router;
