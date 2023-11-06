const path = require('path');
const exphbs = require('express-handlebars');
const morgan = require('morgan');
const multer = require('multer');
const express = require('express');
const routes = require('../routes/index.js');
const erroHandler = require('errorhandler');
const handlebars = require('handlebars');


module.exports = app => {

    //ajustes
    app.set('port', process.env.PORT || 5500)
    app.set('views', path.join(__dirname, '../views'))
    app.engine('.hbs', exphbs.engine({ 
        defaultLayout: 'main', 
        layoutsDir: path.join(app.get('views'), 'layouts'),
        partialsDir: path.join(app.get('views'), 'partials'),
        helpers: require('./helpers'),
        extname: '.hbs', handlebars: handlebars}))

    app.set('view engine', '.hbs')

    //middlewares
    app.use(morgan('dev'));
    app.use(multer({
        dest: path.join(__dirname, '../public/upload/temp')
    }).single('image'))
    app.use(express.urlencoded({
        extended: false
    }))
    app.use(express.json())

    //routes
    routes(app);

    //static files
    app.use('/public', express.static(path.join(__dirname, '../public')));

    //errohandlers
    if ('development' === app.get('env')) {
        app.use(erroHandler);
    }

    return app;
}