import pg from "pg"
const { Pool } = pg
import "dotenv/config"

const pool = new Pool({
    user: process.env.USER,
    host: "localhost",
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: 5432,
})



export default pool