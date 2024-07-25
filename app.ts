import { Request, Response, Express } from "express";
import express from 'express'
import 'dotenv/config'
import dataSource from "./db/dbConfig.js";
import taskRouter from "./routes/task.js"
import { customErrorHandler, DefaultErrorHandler } from "./middleware/ErrorHandler.js";

const app: Express = express();
const PORT = process.env.PORT || 3000

app.use(express.json())

app.use("/tasks", taskRouter)

app.get("/", (req: Request, res: Response) => {
    res.send("Hello world")
})



dataSource.initialize()
.then(()=>{
    console.log("Coneccted to DB");  
})
.catch(()=>{
    console.log("Faild to coneccet to DB");
})

app.use(customErrorHandler)
app.use(DefaultErrorHandler)

let Server = app.listen(PORT, () => {

    console.log("port is running on the " + PORT);
});

export default app;