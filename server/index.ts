import express from 'express';
import "dotenv/config"
const PORT = process.env.PORT
const app = express();
import cors from "cors"
import pool from './db';
import router from './routes/router';


pool.connect((err, client, release) => {
    if (err) {
        console.error('Error acquiring client', err.stack);
    } else {
        console.log('Connected to PostgreSQL');
    }
    release();
});
app.use(express.json())
app.use(cors())
app.use(router)
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} `);
})