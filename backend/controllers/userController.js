import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";

//create token
const createToken = (id, role) => {
    return jwt.sign({id, role}, process.env.JWT_SECRET);
}

//login user
const loginUser = async (req,res) => {
    const {email, password} = req.body;
    try{
        const user = await userModel.findOne({email})

        if(!user){
            return res.json({success:false, message: "User does not exist"})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.json({success:false, message: "Invalid credentials"})
        }

        const token = createToken(user._id, user.role)
        res.json({
            success: true,
            token,
            role: user.role,
            name: user.name
        })
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"})
    }
}

//register user
const registerUser = async (req,res) => {
    const {name, email, password} = req.body;
    try{
        //check if user already exists
        const exists = await userModel.findOne({email})
        if(exists){
            return res.json({success:false, message: "User already exists"})
        }

        // validating email format & strong password
        if(!validator.isEmail(email)){
            return res.json({success:false, message: "Please enter a valid email"})
        }
        if(password.length<8){
            return res.json({success:false, message: "Please enter a strong password"})
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Set role based on email (you can change this to your desired admin email)
        const role = email === 'admin@example.com' ? 'admin' : 'customer'

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
            role
        })
        
        const user = await newUser.save()
        const token = createToken(user._id, user.role)
        res.json({
            success: true,
            token,
            role: user.role,
            name: user.name
        })

    } catch(error){
        console.log(error);
        res.json({success:false, message:"Error"})
    }
}

export {loginUser, registerUser}