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
var User = require('./models/User/user');
var Chat = require('./models/chat/chat');
const { getUserRoom, getUserName, saveMessage, allMessages } = require('./chat');
const { generateMessage } = require('./utils/messages');
const { addUser, removeUser, getUser } = require('./utils/users');
const Understand = require('twilio/lib/rest/preview/Understand');
const personalChat = require('./models/chat/personalChat');
const MONGODB_URI = `mongodb+srv://nipun:nipun@cluster0.i1gmw.mongodb.net/<dbname>?retryWrites=true&w=majority`;
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

    socket.on('join', async ({ userId, phoneNo }, callback) => {
        if (userId == undefined || phoneNo == undefined) {
            return callback('error undefined userId or phoneNo')
        }
        var { room, error_in_room } = await getUserRoom(userId, phoneNo);
        var { username, error_in_username } = await getUserName(userId);
        if (error_in_room) {
            return callback(error_in_room);
        }
        if (error_in_username) {
            return callback(error_in_username);
        }
        console.log(username, room);
        const { err, user } = await addUser({ id: socket.id, username: username, room: room });
        if (err) {
            return callback(err);
        }
        socket.join(user.room);
        const { messages, error_in_messages } = await allMessages(user.room);
        console.log(messages);
        if (error_in_messages) {
            return callback(error_in_messages);
        }
        if (messages != undefined) {
            messages.map((value) => {
                console.log('hello world');
                socket.emit('message', value)
            });
        }
        socket.broadcast.to(user.room).emit('message', `${username} is online`);
    });
    socket.on('sendMessage', async ({ message, userId, phoneNo }, callback) => {
        console.log(userId, phoneNo);
        const user = await getUser(socket.id)
        if (user == undefined || user.length == 0) {
            return callback('NO user is PResent');
        }
        const { room, error_in_room } = await getUserRoom(userId, phoneNo);
        if (error_in_room) {
            return callback(error_in_room);
        }

        const { myMessage, error_in_message } = await saveMessage(room, message, userId);
        if (error_in_message) {
            return callback(error_in_message);
        }
        else {
            console.log('working');
            console.log(user);
            await io.to(user[0].room).emit('message', generateMessage(user[0].username, message));
        }
    })
})
