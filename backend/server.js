const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// require('dotenv').config();
require('dotenv').config({ path: '../.env' });

const authRoutes = require('./routes/auth');
const companyRoutes = require('./routes/company');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Auth routes
app.use('/api/auth', authRoutes);
// app.use('/api', authRoutes);
app.use('/api/companies', companyRoutes);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
