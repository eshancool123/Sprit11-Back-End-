const express = require('express')
const app = express();
const cors = require("cors");
const port = process.env.PORT || 6001
const mongoose = require("mongoose");

require("dotenv").config();

//Eshan123
//eshansenadhi5

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // React frontend URL
  credentials: true, // Allow cookies/session tokens
}));

app.use(express.json());


// MongoDB Configuration
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@spritdb-cluster.1dspl.mongodb.net/SpritDb?retryWrites=true&w=majority&appName=Spritdb-Cluster&tls=true`
  )
  .then(() => console.log("MongoDB Connected Successfully!"))
  .catch((error) => console.log("Error connecting to MongoDB:", error));


// //jwt authentication
// app.post('/jwt', async (req, res) => {
//   const user = req.body;
//   const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
//     expiresIn: '1hr'
//   })
//   res.send({ token });
// })




//   app.get('/', (req, res) => {
//   res.send('Hello World!')
// })


//importe routers here
const playerRoutes = require('./api/routes/playerRoutes');
const teamRoutes = require('./api/routes/teamRoutes');
const noneRoutes = require('./api/routes/noneRoutes');
const authRoutes = require('./api/routes/authRouters');


//use routes

app.use('/players', playerRoutes);
app.use('/teams', teamRoutes);
app.use('/none', noneRoutes);
app.use('/auth', authRoutes);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


//`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@spritdb-cluster.1dspl.mongodb.net/?retryWrites=true&w=majority&appName=SpritDb-Cluster&tls=true`