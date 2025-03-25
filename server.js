require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const SocketServer = require('./socketServer')
const { ExpressPeerServer } = require('peer')
const multer = require('multer');
const Grid = require('gridfs-stream');
const { GridFsStorage } = require('multer-gridfs-storage');
const path = require('path');

const corsOptions = {
    origin: 'http://localhost:3000', // or your specific origin
    credentials: true, // to allow cookies and authentication headers
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
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

const conn = mongoose.connection;

// Initialize GridFS
let gridFSBucket;
conn.once('open', () => {
    gridFSBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'uploads' // This should match the bucketName in your storage config
    });
    // Store database and GridFSBucket in app.locals
    app.locals.db = conn.db;
    app.locals.gridFSBucket = gridFSBucket;

    console.log("GridFS initialized");
});

// Configure storage engine
const storage = new GridFsStorage({
    url: URI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            const filename = `${Date.now()}-${file.originalname}`;
            const fileInfo = {
                filename: filename,
                bucketName: 'uploads',
                metadata: { originalname: file.originalname },
                contentType: file.mimetype // Ensure correct MIME type
            };
            resolve(fileInfo);
        });
    }
});
const upload = multer({ storage });

// Image Upload Route
app.post('/upload', upload.single('file'), (req, res) => {
    res.json({ file: req.file });
});

// Get Image by Filename
app.get('/file/:filename', async (req, res) => {
    try {
        const file = await conn.db.collection('uploads.files').findOne({ filename: req.params.filename });

        if (!file) {
            return res.status(404).json({ message: "File not found" });
        }

        // Check if file is an image
        if (!file.contentType.startsWith("image/") && !file.contentType.startsWith("video/")) {
            return res.status(400).json({ message: "This is the wrong file type of file." });
        }

        res.set('Content-Type', file.contentType);
        res.set('Accept-Ranges', 'bytes'); // Enables seeking for videos

        // Stream the image to the response
        const readStream = gridFSBucket.openDownloadStreamByName(file.filename);
        readStream.on("error", (err) => {
            console.error("Read Stream Error:", err);
            res.status(500).json({ error: "Error reading file" });
        });

        readStream.pipe(res);

    } catch (err) {
        console.error("Error fetching image:", err.message);
        res.status(500).json({ error: err.message });
    }
});

const port = process.env.PORT || 5000
http.listen(port, () => {
    console.log('Server is running on port', port)
})