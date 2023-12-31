const mongoose = require('mongoose')
const express = require('express')
const crud = require('../utils/crud')

//MODEL
const bookSchema = new mongoose.Schema({
    title: {type: String, required: [true, "לספר חייב להיות שם"]},
    author: {type: String, required: [true, "לספר חייב להיות סופר"]},
    zenere: {type: String, required: [true, "לספר חייב להיות ז'אנר"], enum: ["פנטזיה", "רומנטיקה", "אנגלית", "עיון", "מתח"]},
    price: {type: Number, required: [true, "לספר חייב להיות מחיר"]},
    cover: {type: String, required: [true, "לספר חייב להיות כריכה"]},
    summary: {type: String, required: [true, "לספר חייב להיות תקציר"]},
    payBtn: String,
    authorHasMoreBooks: {type: Boolean, default: false}
})

const Book = new mongoose.model("Book", bookSchema)

//HANDLERS
const getBooks = crud.getAll(Book)
const createBook = crud.createOne(Book)
const showBook = crud.getOne(Book, "book")
const updateBook = crud.updateOne(Book)
const deleteBook = crud.deleteOne(Book)


//ROUTES - main: /api/books
const booksRouter = express.Router()

booksRouter.get("/", getBooks)
booksRouter.get("/:id", showBook)

//restricted routes
booksRouter.use(crud.restriction)
booksRouter.post("/" , createBook)
booksRouter.route("/:id").patch(updateBook).delete(deleteBook)

module.exports = booksRouter