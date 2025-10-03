import express from 'express';
import { connectDB } from './dbconfig/dbconfig.js';
import 'dotenv/config'
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

app.get('/', (req, res) => {
    res.send({message: "Hello from backend"});
})


app.listen(PORT, async (req, res) => {
    await connectDB();
    console.log(`Server is running on port ${PORT}`);
})