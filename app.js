const express = require('express')
const app = express()
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' });
const pool = require('./db')
const userRouter = require('./routes/userRoutes')
const taskRouter = require('./routes/taskRoutes')

app.use(express.json());

app.use('/api/v1/users', userRouter)
app.use('/api/v1/tasks', taskRouter)


app.use((err, req, res, next) => {
  console.error(err.message);
  const statusCode = err.status || 500;
  res.status(statusCode).send({
      status: 'error',
      message: err.message || 'something went wrong'
  });
})
app.listen(process.env.PORT, () => {
  console.log(`app listening on port ${process.env.PORT}`)
})