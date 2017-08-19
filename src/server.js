const bodyParser = require('body-parser');
const express = require('express');

const STATUS_USER_ERROR = 422;

const Post = require('./post');

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());

// TODO: write your route handlers here
const sendUserError = (err, res) => {
  res.status(STATUS_USER_ERROR);
  if (typeof err === 'string') {
    res.json({ error: err });
  } else {
    res.json(err);
  }
};

server.get('/posts', (req, res) => {
  Post.find({}, (err, posts) => {
    if (err) {
      res.status(STATUS_USER_ERROR);
      res.json({ error: err });
      return;
    }
    res.json(posts);
  });
});

server.get('/accepted-answer/:soID', (req, res) => {
  Post.find({ $and: [{ soID: { $eq: 111102 } }, { acceptedAnswerID: { $ne: null } }] })
   .exec((error, answer) => {
     if (!answer) {
       sendUserError(error, res);
       return;
     }
     res.json(answer);
   });
  // const { soID } = req.params;
  // const parentID = null;
  // Post.findOne({ soID })
  //   .exec((err, post) => {
  //     if (!post || parentID !== null) {
  //       sendUserError(err, res);
  //       return;
  //     }
  //     Post.findOne({ soID: post.acceptedAnswerID })
  //       .exec((error, answer) => {
  //         if (!answer) {
  //           sendUserError(error, res);
  //           return;
  //         }
  //         res.json(answer);
  //       });
  //   });
});

server.get('/top-answer/:soID', (req, res) => {
  const { soID } = req.params;
  const parentID = null;
  Post.findOne({ soID })
    .exec((err, post) => {
      if (!post || parentID !== null) {
        sendUserError(err, res);
        return;
      }
    });
  // find answers sort by score in descending order (-1)
  // select  from answers where acceptedAnswerID = null
  // return the first element in the array
});

server.get('/popular-jquery-questions', (req, res) => {
  // const arr = [];
  Post.find({
    $and: [
      { tags: { $in: ['jquery'] } },
      { $or: [{ score: { $gt: 5000 } }, { reputation: { $gt: 200000 } }] }] })
      .exec((err, answer) => {
        if (err) {
          sendUserError(err, res);
          return;
        }
        res.json(answer);
      });
});

server.get('/npm-answers', (req, res) => {
  Post.find({ tags: { $in: ['npm'] } })
  .exec((err, answer) => {
    if (err) {
      sendUserError(err, res);
      return;
    }
    res.json(answer);
  });
});
//   db.getCollection('posts').find({{ tags:{$in:['npm']}}})
module.exports = { server };
