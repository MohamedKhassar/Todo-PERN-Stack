import express from "express"
const router = express.Router()
import { createTask, deleteTask, getAll, updateTask } from "../controller/taskController"

router.get("/", getAll)
router.post("/", createTask)
router.put("/:id", updateTask)
router.delete("/:id", deleteTask)

export default router