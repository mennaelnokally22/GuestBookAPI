const User = require('../models/User');
const Message = require('../models/Message');
const CustomError = require('../helpers/customError');

module.exports = async (req, res, next) => {
  const token = req.headers.authorization;
  const { _id } = await User.getUserFromToken(token);
  const blog = await Message.findById(req.params.id);
  if (!blog) throw new CustomError(404, 'Message Not Found');

  if (String(_id) == String(blog.authorId)) {
    req.blog = blog;
    next();
  } else {
    const error = new CustomError(
      'Sorry you are not the author of this message',
      401
    );
    next(error);
  }
};
