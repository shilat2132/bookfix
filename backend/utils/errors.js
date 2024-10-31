/** custom error object with specific message */
class AppError extends Error{
    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
        this.isOperational = true

        Error.captureStackTrace(this, this.constructor);
    }
}

const sendErrorDev = (error, res)=>{
    res.status(error.statusCode).json({
        status: error.status,
        error: error,
        message: error.message,
        stack: error.stack
    })
}

const sendErrorProd = (error, res)=>{
    if(error.isOperational){
        return res.status(error.statusCode).json({
            status: error.status,
            error: error,
            message: error.message,
        })
    }else{
        return res.status(500).json({
            status: 'error',
            message: "something is wrong"
        });
    }
}

/**global error handler
 * handles validation and type error of db's fields
 * both for development and production environments
 */
function errorsHandler(err, req, res, next){
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error';

    let error = {...err}
    error.message = err.message;
    error.name = err.name;

    //here goes the handling functions
    if(error.name === "ValidationError") error= handleValidationErrorDB(error)
    if (error.name === 'CastError') error = handleDBFieldTypeError(error);

    
    if(process.env.NODE_ENV === "development"){
        sendErrorDev(error, res)
    }else{
        sendErrorProd(error, res)
    }
}

/** Processes MongoDB validation errors and returns a formatted AppError. */
function handleValidationErrorDB(error){
    const errors = Object.values(error.errors).map(e=> e.message)
    const message = errors.join('. ')
    return new AppError(message, 400);
}

function handleDBFieldTypeError (error){
    const message = `הערך  ${error.value}, לא חוקי לשדה  ${error.path}`
    return new AppError(message, 400)
}

module.exports = {AppError, errorsHandler};