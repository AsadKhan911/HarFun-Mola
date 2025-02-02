import express from 'express'
const app = express()

import dotenv from 'dotenv'
dotenv.config()

import cookieParser from 'cookie-parser'
import cors from 'cors'

const port = process.env.PORT || 8000

//Routes & Connection
import dbConnection from './conn/connection.js'
import userRoute from './routes/user.route.js'
import majorServiceListings from './routes/majorServiceListing.route.js'
import majorCategory from './routes/majorCategory.route.js'
import bookService from './routes/Booking.route.js'

//Middlewares
app.use(express.json()) 
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(cors())

//API Endpoints
app.use('/api/v1/user' , userRoute)
app.use('/api/v1/majorlistings' , majorServiceListings)
app.use('/api/v1/majorcategory' , majorCategory)
app.use('/api/v1/booklistings' , bookService)

app.listen(port , '0.0.0.0' , ()=>{
    console.log(`Server running at port ${port}`)
    dbConnection()
})