import express from 'express'
const router = express.Router()

// import {   multipleImageUpload  } from '../middlewares/multer.js'
import isAuthenticated from '../middlewares/isAuthenticated.js'
import { createBid, deleteBid, editBid, getBidById, getBids, getBidsByCustomer } from '../controllers/BiddingModule/BidController.js'

router.route('/post-bid').post(isAuthenticated , createBid)
router.route('/get-bid').get(getBids)
router.route('/get-customer-bids').get(getBidsByCustomer)
router.route('/get-bid-ById').get(getBidById)
router.route('/edit-bid').patch(editBid)
router.route('/delete-bid').delete(deleteBid)


export default router