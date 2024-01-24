const express = require('express');
const dotenv = require('dotenv');

const app = express();

const connectDB = require('./middlewares/db_config');


dotenv.config({path:`.env`});

const PORT = process.env.PORT || 3000

// mongodb connection
connectDB();

app.use(express.json()); // For JSON requests
app.use(express.urlencoded({ extended: true })); 


app.use('/admin',require('./routes/admin.route'));
app.use('/user',require('./routes/user.route'));



app.listen(PORT, ()=>{
    console.log(`server is running on http://localhost:${PORT}`)
})

