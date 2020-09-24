const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');

const schema = require('./graphql/schema');
const auth = require('./middleware/auth');

const MONGODB_URI = `mongodb+srv://sonika:sonika@aleph.eomsd.mongodb.net/<dbname>?retryWrites=true&w=majority`;
const app = express() // create express server

app.use(bodyParser.json()) // use body-parser middleware to parse incoming json

const corsOptions = {
    origin: '*',
    methods: [
        'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    ],
    allowedHeaders: [
        'Content-Type, Authorization'
    ]
};

app.use(cors(corsOptions)); //allow requests from any origin
app.use(auth);
app.get('/chat', (req, res) => {
    const room = req.query.room;
    res.render('index');
}
);

app.get('/', (request, response, next) => {
    // a test route to verify the app is running
    response.send('Our App is Live');
});

// app.post('/refresh-token', (req, res, next) => {
//     const refreshToken = req.body.refreshToken;
//     if (!refreshToken) {
//        return res.status(403).send('Access is forbidden');
//     } 
//     try {
//        const newTokens = jwtService.refreshToken(refreshToken, res); 
//        res.send(newTokens);
//     } 
//     catch (err) {
//      const message = (err && err.message) || err;
//      res.status(403).send(message);
//     }
//    });

app.use(
    '/graphql',
    graphqlHttp({
        schema: schema,
        graphiql: true,
        customFormatErrorFn: (error) => ({
            message: error.message,
            locations: error.locations,
            stack: error.stack ? error.stack.split('\n') : [],
            path: error.path,
        })
    })
);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});

mongoose
    .connect(
        MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true },
    )
    .then(result => {
        console.log("DB connected successfully!!!!!!");
        app.listen(3001);
    })
    .catch(err => console.log(err));