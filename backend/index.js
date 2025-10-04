import express from 'express';
import { connectDB } from './dbconfig/dbconfig.js';
import 'dotenv/config'
import authRoutes from './routes/auth.route.js';
import itemRoutes from './routes/item.route.js';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use('/api', authRoutes);
app.use('/api', itemRoutes);


app.listen(PORT, async (req, res) => {
    await connectDB();
    console.log(`Server is running on port ${PORT}`);
})