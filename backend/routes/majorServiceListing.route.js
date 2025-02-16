import express from 'express'
const router = express.Router()

// import { singleUpload } from '../middlewares/multer.js'
import isAuthenticated from '../middlewares/isAuthenticated.js'
import { postListing, getAllListings, getListingById ,getListingsByCategory } from '../controllers/majorServices.controller.js'

//Jabb project final hojae to comments wale routes uncomment krdena or isAuthenticated middlware attach krdena unke sth
// router.route('/post').post(isAuthenticated , postListing)


router.route('/getlisting/:categoryId').get(isAuthenticated , getListingsByCategory)
router.route('/post').post( isAuthenticated , postListing)
router.route('/get').get(isAuthenticated , getAllListings)
router.route('/get/:id').get(isAuthenticated , getListingById)
//Next kam yeh h kay major categories add down karo database mein.

export default router