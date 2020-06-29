const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const socketio = require('socket.io');
const schema = require('./graphql/schema');
const http = require('http');
const path = require('path');
const graphqlResolver = require('./graphql/resolvers');
const auth = require('./middleware/auth');



const { generateMessage } = require('./utils/messages');
const { addUser, removeUser, getUser } = require('./utils/users');

const MONGODB_URI = `mongodb+srv://sonika:sonika@aleph-eomsd.mongodb.net/aleph?retryWrites=true&w=majority`;

const app = express() // create express server

app.use(bodyParser.json()) // use body-parser middleware to parse incoming json











const directory_path = path.join(__dirname + '/views');
app.use(express.static('public'));
app.set('view engine', 'ejs');
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
        // rootValue: graphqlResolver,
        graphiql: true,
        customFormatErrorFn: (error) => ({
            message: error.message,
            locations: error.locations,
            stack: error.stack ? error.stack.split('\n') : [],
            path: error.path,
        })
        // formatError(err) {
        //     if (!err.originalError) {
        //         return err;
        //     }
        //     const data = err.originalError.data;
        //     const message = err.message || 'An error occurred.';
        //     const code = err.originalError.code || 500;
        //     return { message: message, status: code, data: data };
        // }
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




    })
    .catch(err => console.log(err));



const server = http.createServer(app);
const io = (socketio)(app.listen(3000));

io.on('connection', (socket) => {




    socket.on('join', async ({ user, room }, callback) => {
        const { err, use } = await addUser({ id: socket.id, username: user, room: room });
        socket.join(use.room);
        socket.broadcast.to(use.room).emit(
            'message', generateMessage('admin',
                `${use.username} is online`)
        )

    })

    socket.on('sendMessage', async (message, callback) => {

        const user = await getUser(socket.id)
        console.log(user);
        if(user==undefined || user.length==0){
            callback('some network issue');
        }
        else{
            await io.to(user[0].room).emit('message', generateMessage(user[0].username, message));
            callback('delivered')
        }
    })

})
