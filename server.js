const express = require("express");
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();
const db = require('./config/db');
const indexRouter = require('./router/indexRouter');

const app = express();

const port = process.env.PORT || 6000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', indexRouter);

db();

app.listen(port, (error) => {
    if (!error) {
        console.log(`Server is running : http://localhost:${port}`);
    }
});