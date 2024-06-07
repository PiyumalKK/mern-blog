import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import { Http2ServerRequest } from "http2";

export const signup = async (req, res, next) => {
    const {username, email,password} = req.body;

    if(!username || !email || !password || username === '' || email === ''|| password === '')
        {
           // return res.status(400).json({message:"All fields are required"})
           next(errorHandler(400, 'All fields are required'));
        }

        const hashedPassword = bcryptjs.hashSync(password,10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        try {
            await newUser.save();
            res.json("SignUP Successful");
        }catch(error)
        {
           // res.status(500).json({message:error.message});
           next(error);
        }
        
};

export const signin = async (req, res, next) => {
    const { email,password } = req.body;

    if(!email || !password || email === ''|| password === '')
        {
            next(errorHandler(400),'All fields are required');
        }

        try {
            const validUser = await User.findOne({ email});
            if(!validUser)
                {
                  return  next(errorHandler(404,'User not found'));
                }
            const validPassword = bcryptjs.compareSync(password,validUser.password); 
            if(!validPassword)
                {
                  return  next(errorHandler(400,'Password incorrect'));
                }   

                const token = jwt.sign(
                    { id:validUser._id}, process.env.JWT_SECRET_KEY);

                    const { password : pass, ...rest} = validUser._doc;

                res.status(200).cookie('access_token',token, {
                    hhtpOnly: true}).json(rest)
                    
        } catch (error) {
            next(error);
        }
};