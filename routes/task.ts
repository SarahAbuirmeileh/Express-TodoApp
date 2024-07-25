import { Router, Response, Request, NextFunction } from "express";
import { Task } from "../db/entities/Task.js";
import { createTask, deleteTask, getTasks } from "../controllers/task.js";


const router = Router()

router.post("/", async (req:Request, res:Response, next:NextFunction)=>{

    const payload:Task = req.body;

    if(!payload.title || !payload.isDone ){
        res.json({
            messege:"Some feilds are missing",
            success: false
        })
        return;
    }
    try {
        const task = await createTask(payload)

        res.json({
            messege:"Task created successfully",
            success: true
        })
    } catch (error) {
        console.log("Error" + error);
        next(error)
    }
})

router.get("/", getTasks)

// tasks/3
router.delete("/:id", async (req:Request, res:Response, next:NextFunction)=>{

    const id =Number (req.params.id);

    try {
        const task = await deleteTask(id)

        res.json({
            messege:"Task deleted successfully",
            success: true
        })
    } catch (error) {
        console.log("Error" + error);
        next(error)
    }
})

export default router