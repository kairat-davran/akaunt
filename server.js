require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const SocketServer = require('./socketServer')
const { ExpressPeerServer } = require('peer')
const path = require('path');

const allowedOrigins = [
    // Origins for development and testing
    'http://localhost:3000', // React Web
    'http://localhost:8081', // Expo Web (Metro bundler)
    'http://localhost:5000', // Your local testing or API base

    // Home Network IPs for mobile access
    'http://172.20.20.20:8081', // Expo Web (Metro bundler)

    // SPO Network IPs for mobile access
    'http://10.3.0.218:8081', // For mobile access (adjust to your LAN IP)
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.error("CORS blocked origin:", origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
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
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                console.error("Socket.IO CORS blocked origin:", origin);
                callback(new Error('Not allowed by CORS'));
            }
        },
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
app.use('/api', require('./routes/authRouter'));
app.use('/api', require('./routes/userRouter'));
app.use('/api', require('./routes/postRouter'));
app.use('/api', require('./routes/commentRouter'));
app.use('/api', require('./routes/notifyRouter'));
app.use('/api', require('./routes/messageRouter'));
app.use('/api', require('./routes/eventRouter'));
app.use('/api', require('./routes/bazarRouter'));
app.use('/api', require('./routes/uploadRouter'));

const URI = process.env.MONGODB_URL
mongoose.connect(URI).then(() => console.log('MongoDB Connected'))
.catch(err => console.error('Could not connect to MongoDB...', err));

const port = process.env.PORT || 5000
http.listen(port, () => {
    console.log('Server is running on port', port)
})