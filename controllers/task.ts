import { Task } from "../db/entities/Task.js";
import { AppError } from "../errors/AppError.js";


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

export {createTask}