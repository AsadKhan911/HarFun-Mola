import express from 'express'
const router = express.Router()

// import { singleUpload } from '../middlewares/multer.js'
import isAuthenticated from '../middlewares/isAuthenticated.js'

import { addMajorCategories, getMajorCategories } from '../controllers/majorCategory.controller.js'

router.route('/postcategory').post(isAuthenticated , addMajorCategories)
// router.route('/getcategory').get(isAuthenticated , getMajorCategories)
router.route('/getcategory').get(getMajorCategories)
// router.route('/getlisting/:categoryId').get(isAuthenticated , getListingsByCategory)

export default router

