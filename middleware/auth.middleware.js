const User = require("../models/user")
const loggerEvent  = require("../services/logger.service")
const logger =loggerEvent ("auth")
const jwt = require("jsonwebtoken")
const authentication = async(req,res,next) => {
    try{
        if(!req.cookies){
            return res.status(401).send({
                message:"unauthorized user "
            })
        }
let token = req?.cookies?.access_token?.split(" ")[1]
let secretKey ="da3323403ce2ca5d0b2558f68be81e5644a58a98875581e56c449671c0c7bcc2";
console.log("ss"+secretKey)
let valid =await jwt.verify(token,secretKey )

if(!valid){
    return res.status(401).send({
        message:"unauthorized user "
    })
}
let user = await User.findById(valid.id)
console.log(user)
if(!user){
    return res.status(401).send({
        message:"unauthorized user "
    }) 
}
if (!user.tokens.includes(token)){
    return res.status(401).send({
        message:"unauthorized user "
    }) 
}
delete user.tokens
delete user.password
req.user = user
console.log(token);

next()
    }
    catch(error){
        logger.error(error.message)
        return res.status(403).send({
            message:error.message
        })
    }
}
const adminAuthorization = async(req,res,next) =>{
    try{
        authentication(req,res,()=>{
if( !req.user.isAdmin){
    return res.status(403).send({
        message:"unauthorized Admin"
    }) 
}
else{
    next()
}
        })
    }
    catch(error){
        logger.error(error.message)
        return res.status(401).send({
            message:error.message
        })
    }
}
module.exports ={adminAuthorization ,authentication }