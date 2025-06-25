import "dotenv/config";

import jwt from 'jsonwebtoken';


const authUser = async (req, res, next)=>{
    const { token } = req.cookies;
    if(!token){
        return res.json({
            success: false,
            message: "Unauthorized access, please login"
        });
    }
    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        if(tokenDecode.id){
           req.userId = tokenDecode.id;
        }else{
            return res.json({
                success: false,
                message: "Unauthorized access, please login"
            });
        }
        next();
    } catch (error) {
        console.log(error.message);
        res.json({
            success: false,
            message: error.message
        });
    }
}

export default authUser;