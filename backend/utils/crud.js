const catchAsync = require("./catchAsync")
const { AppError } = require("./errors")

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

exports.createOne = Model =>(
    catchAsync(async (req, res, next)=>{
        const doc = await Model.create(req.body)
        res.status(200).json({status: "success", docId: doc._id})
    })
)

exports.getOne = (Model, modelName)=>(
    catchAsync(async (req, res, next)=>{
        const doc = await Model.findById(req.params.id)
        if(!doc){
                return next(new AppError('לא נמצא מסמך מתאים'), 404)
        }
        let extraData;
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

exports.updateOne = Model=>(
    catchAsync(async (req, res, next)=>{
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body,  {new: true, runValidators: true})
        if(!doc){
                return next(new AppError('לא נמצאו מסמך מתאים'), 404)
        }
        res.status(200).json({status: "success", doc})
    })
    
)

exports.deleteOne = Model=>(
    catchAsync(async (req, res, next)=>{
        await Model.findByIdAndDelete(req.params.id)
        res.status(204).json({status: "success"})
    })
)

//restricting MW

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