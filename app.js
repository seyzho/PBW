require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const app = express();
const postRoutes = require('./routes/postRoutes');


app.use(express.json()); 
app.use(helmet());
app.use(cors());

const limiter = rateLimit({
    windowMs: 60 * 60 * 10000, // set to 1 hour
    max: 100 //amount of requests per hour for each ip
});
app.use(limiter);

app.use(morgan('tiny'));



mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((err) => console.log('Could not connect to MongoDB Atlas', err));

app.use('/posts', postRoutes);

app.listen(port, () => {
    console.log (`server listening at http://localhost:${port} `);
});