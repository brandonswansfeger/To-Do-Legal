// Require dependencies
const express = require('express');
const mongoose = require('mongoose');
const Task = require('./models/task.js');
const seedData = require('./models/seed');
const methodOverride = require('method-override');
const morgan = require('morgan');
const task = new Task;

// Initialize Express App
const app = express();

// Configure App Settings
require('dotenv').config();
const DATABASE_URL = process.env.DATABASE_URL;

// Connect to MongoDB
mongoose.connect(DATABASE_URL);

const db = mongoose.connection;

db.on('connected', () => console.log('Connected to MongoDB'));
db.on('error', (error) => console.log('MongoDB Error ' + error.message));

// Mount Middleware
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method')); // _method is a query param that accepts a value
// that value is the http method we want to change to

// Mount Routes

app.get('/tasks/seed', async (req, res) => {
    await Task.deleteMany({});
    await Task.create(seedData);
    res.redirect('/tasks');
});

// Index Route
app.get("/tasks", (req, res) => {
    Task.find({}, (error, allTasks) => {
      res.render("index.ejs", { tasks: allTasks,
      })
    })
  })

// New Route



app.get('/tasks/new', (req, res) => {
    res.render('new.ejs');
});

// Delete Route
app.delete("/tasks/:id", (req, res) => {
    Task.findByIdAndRemove(req.params.id, (err, data) => {
      res.redirect("/tasks")
    })
  })

// Update Route
app.put('/tasks/:id', (req, res) => {
    // this is known as type casting - cast one datatype into another
    req.body.completed = !!req.body.completed; 
    Task.findByIdAndUpdate(req.params.id, req.body, (err, task) => {
        res.redirect(`/tasks/${req.params.id}`);
    }); 
    // Book.findById(req.params.id, (err, book) => {
    //     book.imageURL = req.body.imageURL || book.imageURL
    //     book.title = req.body.title || book.title
    //     book.author = req.body.author || book.author
    //     book.save(() => {
    //         res.redirect(`/books/${req.params.id}`);
    //     })
    // })
}); 

// Create Route
app.post('/tasks', (req, res) => {
    req.body.completed = !!req.body.completed; // !!'on' -> true or !!undefined -> false
    Task.create(req.body, (err, task) => {
        res.redirect('/tasks'); // tells the browser to make another GET request to /books
    });
});

// Edit Route
app.get('/tasks/:id/edit', (req, res) => {
    Task.findById(req.params.id, (err, task) => {
        res.render('edit.ejs', { task });
      });
});

// Show Route
app.get('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        res.render('show.ejs', { task });
    } catch (error) {
        console.log(error.message)
        res.render('error.ejs');
        res.redirect("/tasks");
    }
});



// Tell the App to listen for requests
const PORT = process.env.PORT;
app.listen(PORT, () => { 
    console.log(`Express is listening on port:${PORT}`);
});