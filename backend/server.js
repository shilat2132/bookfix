//packages
const express = require('express')
const dotenv = require("dotenv")
const app = express()
const mongoose = require('mongoose')
const path = require('path')
const cors = require('cors')

//imports of utils
const { AppError, errorsHandler } = require('./utils/errors')

//imports of routes
const booksRouter = require('./collections/books')
const storiesRouter = require('./collections/stories')
const commentsRouter = require('./collections/comments')

app.set('trust proxy', 1);

app.use(cors({ credentials: true,
  origin: ['https://bookfix-api.onrender.com']
}))
app.options('*', cors())

//environment vars configuration
dotenv.config({ path: './config.env' });
app.use(express.static(path.join(__dirname, '../client/build')));

//mongodb connection
mongoose.connect(process.env.DB)
  .then(con => console.log("connected to db")) 
  .catch(err=> console.log(err))


//MIDDLEWARE
app.use(express.json({limit: '10kb'}));
app.use(express.urlencoded({ extended: true }));

//routes MW

app.use("/api/books", booksRouter)
app.use("/api/stories", storiesRouter)
app.use("/api/comments", commentsRouter)
  

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});


app.all('*', (req,res, next)=>{
  next(new AppError (`couldn't reach ${req.originalUrl} on the server`, 404)) 
  //while calling next with an argument, it goes to the global err handling func
})

app.use(errorsHandler)
const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});