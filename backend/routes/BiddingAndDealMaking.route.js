import express from 'express'
const router = express.Router()

import {   multipleImageUpload  } from '../middlewares/multer.js'
import { createBid, deleteBid, editBid, getBidById, getBidsByCustomer } from '../controllers/BiddingModule/BidController.js'

router.route('/post-bid').post(multipleImageUpload , createBid)
router.route('/get-customer-bids').get(getBidsByCustomer)
router.route('/get-bid-ById').get(getBidById)
router.route('/edit-bid').patch(editBid)
router.route('/delete-bid').delete(deleteBid)


export default router