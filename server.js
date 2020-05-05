const express = require('express');
const connectDB = require('./config/db');
const app = express();

//Connection to the database
connectDB
  .authenticate()
  .then(() => console.log('Database connected'))
  .catch((err) => console.log('Error: ' + err));

// Init Middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API Running'));

// Define Routes

app.use('/api/auth', require('./restapi/auth'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Sever started on port ${PORT}`));
