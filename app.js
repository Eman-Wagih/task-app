const express = require('express')
const app = express()
const dotenv = require('dotenv')
const cors = require('cors')
dotenv.config({ path: './config.env' });


const userRouter = require('./routes/userRoutes')
const taskRouter = require('./routes/taskRoutes')

app.use(express.json());
app.use(cors())

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
app.listen(process.env.PORT, async () => {
  console.log(`app listening on port ${process.env.PORT}`)
})