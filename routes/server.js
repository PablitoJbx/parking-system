require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();


app.use(cors());
app.use(express.json());
app.use(morgan('dev'));


connectDB();


app.use('/api', require('./routes/parking.routes'));


app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const authRouter = require('./routes/auth.routes');
const uploadRouter = require('./routes/upload.routes');


app.use(cookieParser());
app.use(fileUpload());


app.use('/api/auth', authRouter);
app.use('/api/upload', uploadRouter);
