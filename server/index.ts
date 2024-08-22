import express from 'express';
import "dotenv/config"
const PORT = process.env.PORT
const app = express();
import cors from "cors"
import pool from './db';


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
app.get("/", async (req, res) => {
    try {
        const student = (await pool.query("SELECT * FROM task;")).rows
        res.json(student);
    } catch (error) {
        const err = error as Error
        console.error(err.message);
        res.status(500).json({ message: err.message.replace("\"task\"", "task") });
    }
})
app.post("/", async (req, res) => {
    const { title, description, priority_id } = req.body
    try {
        await pool.query(`INSERT INTO task (title, description, priority_id) VALUES($1,$2,$3) RETURNING *;`, [title, description, priority_id])
        res.json({
            message: "Created Successfully"
        });

    } catch (error) {
        const err = error as Error
        console.error(err.message);
        res.status(500).json({ message: "Error creating student" });
    }
}
)
app.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { description, title, priority_id } = req.body;
        pool.query("UPDATE task SET title=$1,description=$2,priority_id=$3 where id =$4", [title, description
            , priority_id, id],
            (error, results) => {
                if (error) {
                    throw error
                }
                res.json({
                    message: `Task Updated Successfully with ID: ${id}`
                })
            }
        )
    } catch (error) {
        const err = error as Error;
        console.error('Error:', err.message);
        res.status(500).json({ message: "Error Updating Task" });
    }
})

app.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        pool.query("DELETE FROM task where id =$1", [id],
            (error, results) => {
                if (error) {
                    throw error
                }
                res.json({
                    message: `Task Deleted Successfully with ID: ${id}`
                })
            }
        )
    } catch (error) {
        const err = error as Error;
        console.error('Error:', err.message);
        res.status(500).json({ message: "Error Updating Task" });
    }
})
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} `);
})