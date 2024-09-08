const express = require('express');
const router = express.Router({mergeParams:true});
const catchAsync = require('../utils/catchAsync')
const Comment = require('../models/comments.js')
const Campground = require('../models/campground')
const {validateComment, isLoggedIn, isCommentAuthor} = require('../middleware.js')
const comments = require('../controllers/comments.js')

router.post('/', isLoggedIn, validateComment,catchAsync(comments.createComment));


router.delete('/:commentId',isCommentAuthor,catchAsync(comments.deleteComment))


module.exports = router;