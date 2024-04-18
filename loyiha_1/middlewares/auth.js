const jwt = require('jsonwebtoken')
const asyncHandler = require('../middlewares/async')
const ErrorResponse = require('../utils/error.response')
const enterprise = require('../models/enterprise.models') 
// authorization 
exports.protect = asyncHandler(async (req, res, next) => {
    let token 
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1]
    }
    if(!token){
        return next(new ErrorResponse('He didn\'t miss it', 403))
    }
    const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET)

    req.user = await enterprise.findById(decoded.id)
    next()
})