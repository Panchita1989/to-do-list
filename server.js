// Eq3kxRusj331YY5I

const express = require('express') // install Express 
const app = express()       // saving express in a variable called app
const MongoClient = require('mongodb').MongoClient // install mongodb Database
const PORT = 2121   // saving our port => localhost:2121
require('dotenv').config() // with this method we can save our database password in a seperat file which will be en the gitignore folder


let db,                                             // variable for our database password
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

// connect our database string and pasword to our server inside the monocliend.connect method we will call our middlewares and get, put, delete and listen methods
MongoClient.connect(dbConnectionStr)
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        const db = client.db(dbName)
        const todoList = db.collection('todos')

        app.set('view engine', 'ejs') //we will use a ejs file to render and send back our html
        app.use(express.static('public')) // using static public for css and client side js
        app.use(express.urlencoded({ extended: true })) // transforming the URL string into a javascript object
        app.use(express.json()) // using the format json to revieve request and send responses


        app.get('/',async (request, response)=>{        //everytime we open or refresh our hompage the get request gets trigert, here we tell the program to send the ejs file as a response
            
            todoList.find().toArray()
            .then(data => {                     // now telling the server what response 
                todoList.countDocuments({completed: false}) // counting elements which have the property completed === false
                .then(itemsLeft =>{                 // then giving back a the respnse of this promise (amount of element completed false)
                    response.render('index.ejs', { items: data, left: itemsLeft })
                })
            })
            .catch(err => console.error(err))   // catching error if the get request was not succesfull
            })

            app.post('/addTodo', (request, response) => {           // post request ist for creating a new document in our database
                db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // saying that we want insert one document with everything inside the body and that has property completed false
                .then(result => {           
                    console.log('Todo Added')               // as post gives back a javascript promise we will responde to this promise with .then if everything succesfull or .catch to catch the error
                    response.redirect('/')                     // when all good we want to refresh the homepage
                })
                .catch(error => console.error(error))
            })

            app.put('/markComplete', (request, response) => {               // put request is to updata an existing document from our database
                todoList
                .updateOne({thing: request.body.itemFromJS},{  // we want to change the completed statues from false to true in just this item which we clicked
                    $set: {                                                            // in the filter of the method updateOne() we check with thing: request.body.itemFromJS which item got clicked on
                        completed: true                                                 // with the set method we change the complieted status to true
                    }
                },{
                    sort: {_id: -1},                                                    // with upsert we decide if we want to create this item in case it doesnt exist we decide no so it has the statues false
                    upsert: false
                })
                .then(result => {
                    console.log('Marked Complete')                                      // as well the put request gives back a promise so we give back the response with .then method
                    response.json('Marked Complete')                                    // importand that we have always to give back response.json()
                })
                .catch(error => console.error(error))               // catching errors in case it didnt went well

            })

            app.put('/markUnComplete', (request, response) => { // same as the put request for markcomplete but now we want to set the complete status from true to false
                todoList
                .updateOne({thing: request.body.itemFromJS},{
                    $set: {
                        completed: false
                    }
                },{
                    sort: {_id: -1},
                    upsert: false
                })
                .then(result => {
                    console.log('Marked Uncomplete')
                    response.json('Marked Uncomplete')
                })
                .catch(error => console.error(error))

            })

            app.delete('/deleteItem', (request, response) => {                              // delete request to delete an document from our database
                todoList
                .deleteOne({thing: request.body.itemFromJS})          // here we decide to delete one document in the filter we put the query which document should be deleted
                .then(result => {
                    console.log('Todo Deleted')                                             // as well here we give back a promise so we responde to the promis with .then or catch and always giving back response.json()
                    response.json('Todo Deleted')
                })
                .catch(error => console.error(error))

            })
            app.delete('/deleteAll', (req, res)=>{
                todoList
                .deleteMany({})
                .then(result =>{
                    console.log('Deleted all Items')
                    res.json('Deleted all items')
                })
                .catch(error => console.error(error))
            })

            app.listen(process.env.PORT || PORT, ()=>{                          // we tell the program to which port (localhost: to listen), process.env.PORT this is when we upload our server to someone others computer and thy decide which port 
                console.log(`Server running on port ${PORT}`)
            })

        })
