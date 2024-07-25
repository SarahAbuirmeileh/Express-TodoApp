import { DataSource } from "typeorm";
import { Task } from "./entities/Task.js";

const dataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "mydb",
    synchronize: true,
    logging: false,
    entities: [Task],
})

export default dataSource;
