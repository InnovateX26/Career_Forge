const express = require('express');
const cors = require('cors');
require('dotenv').config();
 
const app = express();

app.use(cors());
app.use(express.json());

const resumeRoutes = require('./routes/resumeRoutes');
app.use('/api/resume', resumeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});

