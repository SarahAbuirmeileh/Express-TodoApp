import { Router, Response, Request, NextFunction } from "express";
import { Task } from "../db/entities/Task.js";
import { createTask } from "../controllers/task.js";


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

export default router