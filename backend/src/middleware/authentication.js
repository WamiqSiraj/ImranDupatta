import jwt from 'jsonwebtoken';
import User from '../models/userSchema.js';

const verifyJWT = async (req, res ,next)=>{
   try {
    const token = req.cookies.accessToken
 
    if(!token){
     return res.json({
         success: false,
         message: "invalid req / no token present"
     })
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
    const user = await User.findById(decodedToken._id).select(
     "-password -refreshToken"
    )
 
    if(!user){
     return res.json({
         success: false,
         message: "invalid access token"
     })
    }
    req.user = user
    next()
   } catch (error) {
       return res.json({
        success: false,
        message: "invalid token"
      })
   }
}

const isAdmin = async (req, res, next)=>{
      if(req.user && req.user.role==="admin"){
        next()
      }else{
        res.status(403).json({
            success: false,
            message: "Access Denied, Admin Only"
        })
      }
}

const softAuth = async (req, res, next) => {
    try {
        // 1. Get token from cookies or Authorization header
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        // 2. If no token, just move to the next middleware/controller
        if (!token) {
            return next(); 
        }

        // 3. If token exists, try to verify it
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        // 4. Attach user to request if found
        if (user) {
            req.user = user;
        }

        next();
    } catch (error) {
        // Even if token is invalid/expired, we don't block the guest
        // We just proceed without req.user
        next();
    }
};

export { verifyJWT, isAdmin, softAuth }