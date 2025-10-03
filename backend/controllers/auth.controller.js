import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";

const hashPassword = (password) => {
    const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 10
    return bcrypt.hashSync(password, SALT_ROUNDS || 10);
}

const comparePassword = (password, hashedPassword) => {
    return bcrypt.compareSync(password, hashedPassword);
}

export const registerUser = async (req, res) => {
    const {name, email, password} = req.body;

    // check if user already exists
    const existingUser = await User.findOne({email});
    if(existingUser) {
        return res.status(400).send({
            message: "User already exists",
            success: false
        })
    }

    // hash the password
    const hashedPassword = hashPassword(password);

    const newUser = new User({
        name, email, password: hashedPassword
    });

    try {
        newUser.save();
        return res.status(201).send(newUser)
    } catch (error) {
        console.log("Error in registering user", error);
        return res.status(500).send({
            message: "Error in registering user",
            success: false,
            error
        })
    }
}

export const loginUser = async (req, res) => {
    const {email, password} = req.body;

    //check if user exists
    try {
        const user = await User.findOne({email});
        if(!user) {
            return res.status(404).send({
                message: "User not found",
                success: false
            })
        }

        //compare password
        const isPasswordValid = comparePassword(password, user.password);
        if(!isPasswordValid) {
            return res.status(401).send({
                message: "Invalid credentials",
                success: false
            })
        }
        
        const userRes = user.toObject();
        delete userRes.password;
        
        return res.status(200).send(userRes);
    } catch (error) {
        console.log("Error in logging in user", error);
        return res.status(500).send({
            message: "Error in logging in user",
            success: false,
            error
        })
    }
}