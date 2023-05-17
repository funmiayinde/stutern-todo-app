const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongooseApp = require('mongoose');

const todos = require('./routes/todo');

mongooseApp.Promise = global.Promise;

mongooseApp.connect('mongodb+srv://funky:TjwE3FZ4LGC31qUi@cluster0.zzefz.mongodb.net/todo_list?retryWrites=true&w=majority')
    .then(() => console.log('Connection successful'))
    .catch((e) => console.error('mongoose-err:::', e))


const app = express()
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extend: false}));
app.use(cookieParser())

app.use('/todos', todos);


app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.message = 'Route not fount';
    next(err);
});

module.exports = app;