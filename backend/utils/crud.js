// this is a file for a general pattern of crud

const catchAsync = require("./catchAsync")
const { AppError } = require("./errors")


/**
 * Retrieves all documents from the specified `Model` based on optional query parameters.
 *
 * - Filters results based on `zenere` and `search` query parameters.
 * - Supports sorting by price if `sortPrice` is provided.

 * Response:
 * - Success: Returns an array of matching documents with a 200 status code.
 * - Failure: Throws a 404 error if no documents are found.
 */
exports.getAll = Model =>(
    catchAsync(async (req, res, next)=>{
        let docs, queryOptions = {};
        if(req.query.zenere && req.query.zenere!== "all"){
            queryOptions = {zenere: req.query.zenere}
        }
        if(req.query.search){
            const searchTerm = req.query.search
            const urlArray = req.originalUrl.split("/")
            const collection = urlArray[2].split("?")[0]
            if(collection === "stories"){
                queryOptions = {...queryOptions, $or: [{title: {$regex: searchTerm, $options: "i" }}, {series: {$regex: searchTerm, $options: "i" }}] }
            }else if(collection === "books"){
                queryOptions = {...queryOptions, $or: [{title: {$regex: searchTerm, $options: "i" }}, {author: {$regex: searchTerm, $options: "i" }}]}
            }
        }

        if(req.query.sortPrice){
            docs = await Model.find(queryOptions).sort({price: parseInt(req.query.sortPrice)})
        }else{
            docs = await Model.find(queryOptions)
        }
        
        if(!docs){
                return next(new AppError('לא נמצאו מסמכים מתאימים'), 404)
        }
        res.status(200).json({status: "success", docs})
    })
)


/** create new doc of the model
 * @returns status code of 200 if successful and docId which is the id of the new document*/ 
exports.createOne = Model =>(
    catchAsync(async (req, res, next)=>{
        const doc = await Model.create(req.body)
        res.status(200).json({status: "success", docId: doc._id})
    })
)


/** retrives the specific document of the given model by its id, and any additional data
 * @param Model the itself and its name
 * @returns the document and additional data if exists or 404 error if not found
 */
exports.getOne = (Model, modelName)=>(
    catchAsync(async (req, res, next)=>{
        const doc = await Model.findById(req.params.id)
        if(!doc){
                return next(new AppError('לא נמצא מסמך מתאים'), 404)
        }
        let extraData;

        // for a story - retrieves the books from the same series, for a book - retrives the books of the same authors
        if(modelName === "story" && doc.series){
            const seriesBooks = await Model.find({_id: {$ne: doc._id}, series: doc.series})
            extraData = seriesBooks
        }else if(modelName === "book" && doc.authorHasMoreBooks){
            const authorBooks = await Model.find({_id: {$ne: doc._id}, author: doc.author})
           extraData = authorBooks
        }
        res.status(200).json({status: "success", doc, extraData})
    })
)


/**
 * Updates a document by id with provided in the URL.

 * Response:
 * - Success: Returns the updated document with a 200 status code.
 * - Failure: Throws a 404 error if the document with the provided ID is not found.
 */
exports.updateOne = Model=>(
    catchAsync(async (req, res, next)=>{
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body,  {new: true, runValidators: true})
        if(!doc){
                return next(new AppError('לא נמצאו מסמך מתאים'), 404)
        }
        res.status(200).json({status: "success", doc})
    })
    
)


/** finds a doc by id and deletes returns 204 code */
exports.deleteOne = Model=>(
    catchAsync(async (req, res, next)=>{
        await Model.findByIdAndDelete(req.params.id)
        res.status(204).json({status: "success"})
    })
)


//restricting MW

/**  Middleware to restrict access to certain routes based on a secret key.
 *
 * - Verifies authorization for specific routes (`/comments`) and methods (`GET` and `DELETE`) using a secret key.
 * - Checks if the secret key is provided either in the request body, URL parameters, or the URL itself.
 * - If the secret matches the one stored in the environment (`process.env.SECRET`), the request is authorized.
 * - If the secret is invalid or missing, it throws a 401 Unauthorized error. */
exports.restriction = catchAsync(async (req, res, next)=>{
    let isAuthorized = false;
    const urlArray = req.originalUrl.split("/")
    if(urlArray[2] === "comments" &&(req.method === "GET" || req.method === "DELETE")){
        const secret = urlArray[urlArray.length-1]
        isAuthorized = secret === process.env.SECRET
    }
    if(req.body.secret && req.body.secret === process.env.SECRET){
        isAuthorized = true
    }else if(req.params.secret && req.params.secret === process.env.SECRET){
        isAuthorized = true
    }

    if(!isAuthorized){
        return next(new AppError('אינך מוסמך לבצע פעולה זו'), 401)
    }
    next()
})