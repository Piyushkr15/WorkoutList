require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const workoutRoutes = require('./routes/workouts')
const userRoutes = require('./routes/user')
const path = require("path")

//express app
const app = express()


//middleware
app.use(express.json())

app.use((req, res, next) => {
    // console.log(req.path, req.method);
    next()
})

//routes
app.use('/api/workouts', workoutRoutes)
app.use('/api/user', userRoutes)


// --------------------------deployment------------------------------
// __dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/build")));

    app.get("*", (req, res) =>
        // res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
        res.sendFile(path.join(__dirname, "../frontend/build/index.html"))
    );
} else {
    app.get("/", (req, res) => {
        res.send("API is running..");
    });
}
// --------------------------deployment------------------------------


//connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log("Connected to Db & listening on port", process.env.PORT);
        })
    })
    .catch((error) => {
        console.log(error);
    })
