const express = require('express')
const colors = require('colors')
const connectDB = require('./config/db')
const morgan = require('morgan')
const errorHandler = require('./middlewares/error')
const cors = require('cors')

const dotenv = require('dotenv')
dotenv.config()

connectDB()

const app = express()



app.use(express.json())
app.use(express.urlencoded({extended : false}))

app.use(cors())

app.use('/enterprise', require('./routers/enterprise.router'))
app.use('/proxy', require('./routers/proxy.router'))

app.use(errorHandler)

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`server runing on port ${PORT}`.bgBlue)
})