import express from 'express'
const router = express.Router()

import { singleUpload } from '../middlewares/multer.js'
import isAuthenticated from '../middlewares/isAuthenticated.js'
import { postListing, getAllListings, getListingById ,getListingsByCategory } from '../controllers/majorServices.controller.js'
import { addMajorCategories, getMajorCategories } from '../controllers/majorCategory.controller.js'

//Jabb project final hojae to comments wale routes uncomment krdena or isAuthenticated middlware attach krdena unke sth
// router.route('/post').post(isAuthenticated , postListing)
router.route('/post').post(singleUpload, isAuthenticated , postListing)
router.route('/get').get(isAuthenticated , getAllListings)
router.route('/get/:id').get(isAuthenticated , getListingById)
router.route('/postcategory').post(isAuthenticated , addMajorCategories)
// router.route('/getcategory').get(isAuthenticated , getMajorCategories)
router.route('/getcategory').get(getMajorCategories)
// router.route('/getlisting/:categoryId').get(isAuthenticated , getListingsByCategory)
router.route('/getlisting/:categoryId').get(isAuthenticated , getListingsByCategory)

//Next kam yeh h kay major categories add down karo database mein.

export default router