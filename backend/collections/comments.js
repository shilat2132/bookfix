const mongoose = require('mongoose')
const express = require('express')
const crud = require('../utils/crud')

//MODEL
const commentSchema = new mongoose.Schema({
    name: {type: String, required: [true, "לא הזנת שם"]},
    email: String,
    text: {type: String, required: [true, "לא הזנת תגובה"]},
    story:{
        type: mongoose.Schema.ObjectId,
        ref: 'Story',
        required: [true, "תגובה מוכרחה להיות מקושרת לספר"]
    }
})

// populates the name of the story which the comment was written on
commentSchema.pre(/^find/, function(next){
    this.populate({path: "story", select: "title"}) 
    next()
})
const Comment = new mongoose.model("Comment", commentSchema)

//HANDLERS
const getComments = crud.getAll(Comment)
const createComment = crud.createOne(Comment)
const showComment = crud.getOne(Comment, "comment")
const updateComment = crud.updateOne(Comment)
const deleteComment = crud.deleteOne(Comment)


//ROUTES - main: /api/comments
const commentsRouter = express.Router()

commentsRouter.post("/" , createComment)


//restricted routes
commentsRouter.use(crud.restriction)
commentsRouter.get("/:secret", getComments)
commentsRouter.delete("/:id/:secret", deleteComment)

module.exports = commentsRouter