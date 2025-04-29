import express from 'express'
const app = express()

import dotenv from 'dotenv'
dotenv.config()


import cors from 'cors'

const port = process.env.PORT || 8000

//Routes & Connection
import dbConnection from './conn/connection.js'
import userRoute from './routes/user.route.js'
import majorServiceListings from './routes/majorServiceListing.route.js'
import majorCategory from './routes/majorCategory.route.js'
import bookService from './routes/Booking.route.js'
import payments from './routes/payment.route.js'
import minorCategory from './routes/minorCategory.route.js'
import minorService from './routes/minorServices.route.js'
import BiddingAndDealMaking from './routes/BiddingAndDealMaking.route.js'
import AssistiveFixNavigator from './routes/assistiveFix.route.js'
import IntelliServe from './routes/recommendations.route.js'
import { User } from './models/User/user.js'

//Middlewares
app.use(express.json()) 
app.use(express.urlencoded({extended:true}))
app.use(cors())

// app.put('/update-services/:id', async (req, res) => {
//     const userId = req.params.id; // Get the user ID from the URL parameters
//     const { servicesOffered } = req.body; // Get the new services from the request body
  
//     try {
//       // Update the user document by their ID and set the new services
//       const updatedUser = await User.findByIdAndUpdate(
//         userId,
//         { servicesOffered }, // Update the servicesOffered field
//         { new: true } // Option to return the updated document
//       );
  
//       if (!updatedUser) {
//         return res.status(404).json({ error: 'User not found' });
//       }
  
//       res.json(updatedUser); // Return the updated user
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Something went wrong' });
//     }
//   });

//API Endpoints

app.use('/api/v1/user' , userRoute)
app.use('/api/v1/majorlistings' , majorServiceListings)
app.use('/api/v1/majorcategory' , majorCategory)
app.use('/api/v1/booklistings' , bookService)
app.use('/api/v1/bookingpayment' , payments)
app.use('/api/v1/minorcategory' , minorCategory)
app.use('/api/v1/minorservice' , minorService)
app.use('/api/v1/biddingAndDealMaking' , BiddingAndDealMaking)
app.use('/api/v1/assistiveFix' , AssistiveFixNavigator)
app.use('/api/v1/intelliServe' , IntelliServe)

app.listen(port , '0.0.0.0' , ()=>{
    console.log(`Server running at port ${port}`)
    dbConnection()
})