import jwt from "jsonwebtoken";

const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;

export const generateToken = (userId) => {
    const token = jwt.sign({userId}, JWT_PRIVATE_KEY, {expiresIn: '1d'});
    return token;
}

export const decodeToken = (token) => {
    return jwt.verify(token, JWT_PRIVATE_KEY);
}

