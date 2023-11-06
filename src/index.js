const express = require('express');

const config = require('./server/config');

//Vinculación con la Base de datos
require('./database');

//Inicialización del servidor
const app = config(express());


app.listen(app.get('port'), ()=>{
    console.log('server on port', app.get('port'))
});