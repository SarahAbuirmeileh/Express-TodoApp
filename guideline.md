# Express Application using Typescript

In this simple tutorial we will take a detailed gide to build robust Express Application using Typescript. The tutorial is divided into sections, each section has some steps.

## Section 1 : Install Requirements
To be able to create this Application you have to install some dependencies, follow these steps :

1. Install VSCode or any suitable IDE you want. [Download Link](https://code.visualstudio.com/download) 
    * Make sure to install LST version. 

2. Install node.[Download Link](https://nodejs.org/en) 
    * Make sure to install LST version. 

3. Install git. [Download Link](https://git-scm.com/downloads) 

4. Install  Xampp or any software that run Mysql server.[Download Link](https://www.apachefriends.org/) 

5. Install Dbeaver or ant visualizing tool to see Database. [Download Link](https://dbeaver.io/download/) 

6. Install Postman to test your endpoints.  [Download Link](https://www.postman.com/downloads/) 
<br><br>

## Section 2 : Set up the basic structure for you application
### 2.1 Create basic folders and files
Create new folder for your application, then open your terminal and move to the new folder you have just created it. Use this command to make the basic strutter 

```bash
npx create-express-with-typescript app-name
```

Choose :
`Functional base Express Server Want to create.`


### 2.2 Follow the convention for the file strutter and folders
You basically should have these folders and files

```
my-express-app/
├── controllers/
│   └── .ts
├── db/
│   ├── dbConfig.ts
│   └── entities/
│       └── .ts
|── errors/
│   └── AppError.ts
├── middleware/
│   └── ErrorHandler.ts
├── routes/
│   └── .ts
├── app.ts
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md

```

### 2.3 Edit the tsconfig.ts to make sure that compile typescript to javascript
* Make sure to these lines uncommitted in tsconfig.ts
    ```typescript
    "target": "ESNext", 
    "experimentalDecorators": true,                 
    "emitDecoratorMetadata": true, 
    "module": "NodeNext", 
    "rootDir": "./", 
    "moduleResolution": "NodeNext", 
    "strictPropertyInitialization": false,   
    ```

* In your package.json file in add this
    ```
    "type": "module",
    ```

* Create .env file to store you environment variables

### 2.4 Create simple Express.js application
Make sure to have these in your app.ts file as basic script 
```typescript
const app: Express = express();
const PORT = process.env.PORT || 3000 // Don't forget to add PRT variable in your .env file

app.use(express.json()) // Middleware to parse JSON request bodies


let Server = app.listen(PORT, () => {
    console.log("App is running on port " + PORT);
});

export default app;
```

### 2.5 Test your Application
Using this command in the terminal 

`npm run dev`

Your application should be working correctly and you should see something like this 


`App is running on port 3000`

<br><br>

## Section 3 : Set Database  connection & requirements
### 3.1 Start Mysql server e.g.: using Xammp
### 3.2 Create connection for database
Open your Dbeaver or any other tool, create new connection for Mysql, let the host be "localhost" and username be "root" password be "" and port "3306".

You can change them if you want.

Then create any database you want, e.g.: TodoDB

### 3.4 Install ORM requirements in your app

```bash
npm install typeorm --save
npm install mysql --save 
```

### 3.5 Connect database to your express app
In `db/dbConfig.ts` create data source to connect to database

```typescript
 const dataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "TodoDB",
    synchronize: true,
    logging: false,
    entities: [],
})

export default dataSource;
```

* Remember that some fields may be different in you app, e.g.: **database** you should write your database name as you cerated it in Dbeaver.

* For security measures store database variables in **.env** file
```
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_NAME=mydb
```

### 3.6 Test database connection to your app
Add this in app.ts
```typescript
dataSource.initialize()
.then(()=>{
    console.log("Connected to DB");  
})
.catch(()=>{
    console.log("Failed to connect to DB");
})
```

If everything works good, when running you app you should see this 

`Connected to DB`

### 3.7 Create your entities (tables)
In `db/entities` create ts file to create your entity, you should have this basic: 

```typescript
@Entity()
export class entityName extends BaseEntity{
    // You write your columns types and restrictions, you can see typeORM documentation for details
}
```

* Don't forget to add it in datasourse in this felid  
`entities: []`

Your Database is ready now !!!!!!

<br><br>

## Section 4 : Error handling
### 4.1 Create custom error 
In `errors/AppError.ts` add this:
```typescript
type HttpCode = 400 | 401 | 403 | 404 | 409 | 500;

export class AppError extends Error {
    public readonly httpCode: HttpCode;
    public readonly isOperational: boolean;

    constructor(description: string, httpCode: HttpCode, isOperational: boolean) {
        super(description);

        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain

        this.httpCode = httpCode;
        this.isOperational = isOperational;

        Error.captureStackTrace(this);
    }
}
```

* This code defines a custom error class, **AppError**, which extends the built-in **Error** class to include additional properties: **httpCode** for the **HTTP status code** and **isOperational** for distinguishing between expected (operational) and unexpected errors. The constructor sets these properties and captures the stack trace for better debugging.

### 4.2 Create middleware for error handling
In `middleware/ ErrorHandler.ts` write this code to handel error
```typescript
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError.js';

// Custom Error handler middleware 
export function customErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    if (err instanceof AppError) {
        res.status(err.httpCode).json({ success: false, error: err.message });
    } else {
        // Handle other errors here
        console.error("Error :( => ", err);
        res.status(500).json({ success: false, error: "Something went wrong" });
    }
}

// default error handler
export function DefaultErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    console.log("Catch Error :(( => ", err);
    res.status(err.status || 500).send({ error: "Internal server error" });
}
```

* This code defines two error-handling middlewares for an Express.js application:

    1. **Custom Error Handler (customErrorHandler):**

        It checks if the error is an instance of AppError.
        If true, it sends a JSON response with the HTTP status code and error message from the AppError instance.
        For other errors, it logs the error and sends a generic 500 Internal Server Error response.

    2. **Default Error Handler (DefaultErrorHandler):**

        It sets local variables for the error message and stack trace, depending on whether the app is in development mode.
        It logs the error and sends a generic 500 Internal Server Error response, ensuring any unhandled errors are caught and reported.

### 4.4 Use error handler middleware 
Add this to your `app.ts`
```typescript
app.use(customErrorHandler)
app.use(DefaultErrorHandler)
```

<br><br>

## Section 5 : Create simple CRUD operations
   * C : Create  -> POST method
   * R : Read    -> GET method
   * U : Update  -> PUT method
   * D : Delete  -> DELETE method

### 5.1  Create 
To make good create method you should check these concerns:
1. The user send you the whole data needed to create new object, if not send him message to tell him to send the entire needed data
    * You may also validate the sent data, e.g.: check if the email which sent by the user is a valid email

2. Check if the new object which you want to create is really new and we don't have it in database before, if not throw error to tell the user that this object is already exists in database.

In `controllers/fileName.ts`

Here is simple controller to do this:
```typescript
// Consider Object is your entity which is in `entities`folder
const createObject= async (payload:Object)=>{
    const object = await Object.findOne({
        where:{ 
            /*
                Check for felids for the object, e.g.:
                title:payload.title
            */
        }
    })

    if(object){
        throw new AppError("Object already exits", 409, true)
    }

    const newObject = Object.create(payload)
    return newObject.save()
}
```

Now we use this controller in the `route.ts` file
```typescript
const router = Router()

router.post("/", async (req:Request, res:Response, next:NextFunction)=>{

    const payload:Object = req.body;

    if(****){ 
        res.json({ // Check if the entire needed data is sent by the user
            message:"Some felids are missing",
            success: false
        })
        return;
    }
    try {
        const object = await createObject(payload)

        res.json({
            message:"Object created successfully",
            success: true
        })
    } catch (error) {
        console.log("Error" + error);
        next(error)
    }
})

export default router
```


### Get
The simplest method, it should brings the whole objects from database 

Here is simple controller to do this:
```typescript
const getObjects = async (req:Request, res:Response)=>{
    const objects = await Object.find()

    res.json({
        message :"Getting all objects",
        objects : objects
    })
}
```

Now we use this controller in the `route.ts` file
```typescript
router.get("/", getObjects)
```

### Delete
To make good create method you should check these concerns:
1. The id (unique identifier) for the object should be sent in the request params

2. Check if the new object which you want to delete exits in the database, if not throw error to tell the user that this object is not exists in database so we can't delete it. 

Here is simple controller to do this:
```typescript
const deleteObject = async (id:number)=>{
    const object = await Object.findOne({ where:{ id: id }})

    if(!object){
        throw new AppError("Object not found ", 404, true)
    }

    return object.remove()
}
```

Now we use this controller in the `route.ts` file
```typescript
router.delete("/:id", async (req:Request, res:Response, next:NextFunction)=>{

    const id =Number (req.params.id); // Parsing the id from string to number, by default it comes as a string from the request params

    try {
        const task = await deleteObject(id)

        res.json({
            message:"Object deleted successfully",
            success: true
        })
    } catch (error) {
        console.log("Error" + error);
        next(error)
    }
})
```

### Update
It's very similar to delete. To make good create method you should check these concerns:
1. The id (unique identifier) for the object should be sent in the request params

2. Check if the new object which you want to update exits in the database, if not throw error to tell the user that this object is not exists in database so we can't update it. 

3. The new data for the object that we should edit it should be sent in the request body. It's best practice to validate it before updating the object.

Here is simple controller to do this:
```typescript
const updateObject = async (id:number)=>{
    const object = await Object.findOne({ where:{ id: id }})

    if(!object){
        throw new AppError("Object not found ", 404, true)
    }

    // You should do this for all object attributes
    if(payload.title){
        task.title = payload.title
    }

    return object.save()
}
```

Now we use this controller in the `route.ts` file
```typescript
router.update("/:id", async (req:Request, res:Response, next:NextFunction)=>{

    const id =Number (req.params.id);

    try {
        const task = await updateObject(id)

        res.json({
            message:"Object edited successfully",
            success: true
        })
    } catch (error) {
        console.log("Error" + error);
        next(error)
    }
})
```

# By this you'll create simple Express.js Application !!! Congratulations !!!!
