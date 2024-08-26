import { Request, Response } from "express";
import pool from "../db";

const getAll = async (req: Request, res: Response) => {
    try {
        const student = (await pool.query("SELECT task.id,task.title,task.completed,priority.name as priority FROM task LEFT JOIN priority ON task.priority_id=priority.id ORDER BY task.id ASC;")).rows
        res.json(student);
    } catch (error) {
        const err = error as Error
        console.error(err.message);
        res.status(500).json({ message: err.message.replace("\"task\"", "task") });
    }
}

const createTask = async (req: Request, res: Response) => {
    const { completed, title, priority } = req.body

    try {
        const priority_id = (await pool.query("SELECT id FROM priority where name=$1", [priority])).rows[0]
        await pool.query(`INSERT INTO task (completed, title, priority_id) VALUES($1,$2,$3);`, [completed, title, priority_id.id])
        res.json({
            message: "Created Successfully"
        });

    } catch (error) {
        const err = error as Error
        console.error(err.message);
        res.status(500).json({ message: "Error creating student" });
    }
}

const updateTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { completed, title, priority } = req.body;
        const priority_id = (await pool.query("SELECT id FROM priority where name=$1", [priority])).rows[0]
        pool.query("UPDATE task SET title=$1,completed=$2,priority_id=$3 where id =$4", [title, completed
            , priority_id.id, id],
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
}
const deleteTask = async (req: Request, res: Response) => {
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
}
export {
    getAll,
    createTask,
    updateTask,
    deleteTask,

}