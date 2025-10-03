import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";
import { generateToken } from "../lib/decodeToken.js";

const hashPassword = async (password) => {
    const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 10
    return await bcrypt.hash(password, SALT_ROUNDS || 10);
}

const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
}

export const registerUser = async (req, res) => {
    const {name, email, password} = req.body;

    // check if all fields are provided
    if(!name || !email || !password) {
        return res.status(400).send({
            success: false,
            message: "All fields are required"
        })
    }

    if(password.length < 6) {
        return res.status(400).send({
            success: false,
            message: "Password must be at least 6 characters long"
        })
    }

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
        await newUser.save();

        return res.status(201).send({
            user: {id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role},
            message: "User registered successfully",
            success: true
        })
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

    // check if all fields are provided
    if(!email || !password) {
        return res.status(400).send({
            success: false,
            message: "All fields are required"
        })
    }

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

        // generate token
        const token = generateToken(user._id);
        return res.status(200).send({
            sucess: true,
            token,
            user: {id: user._id, name: user.name, email: user.email, role: user.role}
        });
    } catch (error) {
        console.log("Error in logging in user", error);
        return res.status(500).send({
            message: "Error in logging in user",
            success: false,
            error
        })
    }
}