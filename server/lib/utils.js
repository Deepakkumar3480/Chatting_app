
import jwt from 'jsonwebtoken'

export const generateToken = (userId)=>{
    const token = jwt.sign({userId},process.env.JWT_SECURE_KEY);
    return token;
}