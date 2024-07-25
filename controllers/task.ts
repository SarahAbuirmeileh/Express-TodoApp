import { Task } from "../db/entities/Task.js";
import { AppError } from "../errors/AppError.js";
import {Request, Response } from "express"


const createTask = async (payload:Task)=>{
    const task = await Task.findOne({
        where:{ 
            title:payload.title,
            isDone: payload.isDone
        }
    })

    if(task){
        throw new AppError("Task already exits", 409, true)
    }

    const newTask = Task.create(payload)
    return newTask.save()
}

const getTasks = async (req:Request, res:Response)=>{
    const tasks = await Task.find()

    res.json({
        message :"Getting all tasks",
        tasks : tasks
    })
}

const deleteTask = async (id:number)=>{
    const task = await Task.findOne({ where:{id:id }})

    if(!task){
        throw new AppError("Task not found ", 404, true)
    }

    return task.remove()
}

const editTask = async (id:number, payload:Task)=>{
    const task = await Task.findOne({ where:{id:id }})

    if(!task){
        throw new AppError("Task not found ", 404, true)
    }

    if(payload.title){
        task.title = payload.title
    }

    if(payload.isDone){
        task.isDone = payload.isDone
    }

    return task.save()
    
}

export {createTask, getTasks, deleteTask, editTask}