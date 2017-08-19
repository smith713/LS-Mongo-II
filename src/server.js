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
  Post.find({
    $and:
    [
      { soID: { $eq: req.params.soID } }, { acceptedAnswerID: { $ne: null } }
    ]
  })
   .exec((error, answer) => {
     if (!answer) {
       sendUserError(error, res);
       return;
     }
     res.json(answer);
   });
});

server.get('/top-answer/:soID', (req, res) => {
  Post.find({
    $and:
    [
      { soID: { $eq: req.params.soID } }, { acceptedAnswerID: { $ne: null } }, { parentID: { $ne: null } }
    ]
  })
  .sort({ score: -1 })
    .exec((error, answer) => {
      if (!answer) {
        sendUserError(error, res);
        return;
      }
      res.json(answer);
    });
});

server.get('/popular-jquery-questions', (req, res) => {
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
  Post.find({
    $and:
    [
      { tags: { $in: ['npm'] } }, { parentID: { $eq: null } }
    ]
  })
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
