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

// Configure environment variables from config.env file - dotenv package allows to use process.env
dotenv.config({ path: './config.env' });

//mongodb connection
mongoose.connect(process.env.DB)
  .then(con => console.log("connected to db")) 
  .catch(err=> console.log(err))
  
app.set('trust proxy', 1);
//  Allow cookies to be sent with requests
app.use(cors({ credentials: true,
  origin: ['https://bookfix-api.onrender.com']
}))
app.options('*', cors())

// Serve static files from the React client build directory
app.use(express.static(path.join(__dirname, '../client/build')));




//MIDDLEWARE
  // express.json(): Parses incoming JSON requests.
  // express.urlencoded(): Parses data like form submissions.
app.use(express.json({limit: '10kb'}));
app.use(express.urlencoded({ extended: true }));

//routes MW
app.use("/api/books", booksRouter)
app.use("/api/stories", storiesRouter)
app.use("/api/comments", commentsRouter)
  
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/src/index.html'));
});
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../client/build/index.html'));
// });


app.all('*', (req,res, next)=>{
  next(new AppError (`couldn't reach ${req.originalUrl} on the server`, 404)) 
  //while calling next with an argument, it goes to the global err handling func
})

app.use(errorsHandler)
const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});