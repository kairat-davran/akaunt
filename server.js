require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const SocketServer = require('./socketServer')
const { ExpressPeerServer } = require('peer')

const corsOptions = {
    origin: 'http://localhost:3000', // or your specific origin
    credentials: true, // to allow cookies and authentication headers
    // you can add more options as needed
};

const app = express()
app.use(express.json())
app.use(cors(corsOptions));
app.use(cookieParser())
app.options('*', cors(corsOptions)); // include before other routes

// Socket
const http = require('http').createServer(app)
const io = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000", // Allow frontend origin
        methods: ["GET", "POST"],
        credentials: true
    }
})

io.on('connection', socket => {
    SocketServer(socket)
})

// Create peer server
ExpressPeerServer(http, { path: '/' })

// Routes
app.use('/api', require('./routes/authRouter'))
app.use('/api', require('./routes/userRouter'))
app.use('/api', require('./routes/postRouter'))
app.use('/api', require('./routes/commentRouter'))
app.use('/api', require('./routes/notifyRouter'))
app.use('/api', require('./routes/messageRouter'))

const URI = process.env.MONGODB_URL
mongoose.connect(URI).then(() => console.log('MongoDB Connected'))
.catch(err => console.error('Could not connect to MongoDB...', err));

const port = process.env.PORT || 5000
http.listen(port, () => {
    console.log('Server is running on port', port)
})