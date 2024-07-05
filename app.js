const express = require('express');
const createError = require('http-errors');
const morgan = require('morgan');
const postRouter = require('./routes/postRoutes')
const authRouter = require('./routes/authRouter')
require('dotenv').config();
const mongoose = require("mongoose")
const redis = require('redis')
const session = require('express-session')
const {REDIS_URL, REDIS_PORT, SESSION_SECRET} = require('./config/index')
const {MONGO_IP,MONGO_PASSWORD,MONGO_PORT,MONGO_USER} = require('./config')
const MONGO_URL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`

let RedisStore = require('connect-redis').default
let redisClient = redis.createClient({
  host:REDIS_URL,
  port:REDIS_PORT
})
// redisClient.connect().catch(console.error)
const connectWithRetry = ()=>{
  mongoose.connect(MONGO_URL).then(()=>{
    console.log("connection success")
  }).catch(err=>{
    console.log(err.message)
    setTimeout(() => {
      connectWithRetry()
    }, 5000);
  })
}
connectWithRetry()

const app = express();


app.use(express.json());
app.use(session({
  store:new RedisStore({client:redisClient}),
  secret:SESSION_SECRET,
  cookie:{
    secure:false,
    resave:false,
    saveUninitialize:false,
    httpOnly:true,
    maxAge:30000
  }
}))
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

app.get('/', async (req, res, next) => {
  res.send({ message: 'Awesome it works 🐻' });
});

// app.use('/api', require('./routes/api.route'));
app.use('/api/v1/users', authRouter)
app.use('/api/v1/posts', postRouter)

app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));
