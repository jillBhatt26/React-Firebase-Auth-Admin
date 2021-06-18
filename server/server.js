const express = require('express');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true }));

const PORT = 5000;
const HOST = 'localhost';

app.listen(PORT, HOST, err => {
    if (err) console.log('Hosting Error: ', err.message);
    else {
        console.log(`Server Hosted on PORT ${PORT}`);
    }
});

app.use('/', userRoutes);
