import express from 'express'
const router = express.Router()

// import {   multipleImageUpload  } from '../middlewares/multer.js'
import isAuthenticated from '../middlewares/isAuthenticated.js'
import { createBid, deleteBid, editBid, getBidById, getBids, getBidsByCustomer } from '../controllers/BiddingModule/BidController.js'
import { placeBidOffer , getBidOffersByBidId , getAllBidOffersForUser } from '../controllers/BiddingModule/PlaceBidController.js'
import { getAllJobsPostedByUser , saveJob, updateJobById } from '../controllers/BiddingModule/MyJobs.js'
import { acceptBidOffer, getInterviewingOffers, getProviderOfferResponses, hireBidOffer, rejectBidOffer } from '../controllers/BiddingModule/Contract.controller.js'

router.route('/post-bid').post(isAuthenticated , createBid)
router.route('/get-bid').get(getBids)
router.route('/get-customer-bids').get(getBidsByCustomer)
router.route('/get-bid-ById').get(getBidById)
router.route('/edit-bid').patch(editBid)
router.route('/delete-bid').delete(deleteBid)

//Place bid by service provider
router.route('/place-bid').post(isAuthenticated , placeBidOffer)
router.route('/bid-offers/:bidId').get(getBidOffersByBidId)
router.route('/all-jobs-bid-offers/:userId').get(getAllBidOffersForUser)

//User posted jobs
router.route('/get-all-jobs/:userId').get(getAllJobsPostedByUser)
router.route('/edit-job/:jobId').put(updateJobById)

//Create contract
router.route('/accept-bid').post(acceptBidOffer)
router.route('/reject-bid').post(rejectBidOffer)
router.route('/get-offers-responses/:serviceProviderId').get(getProviderOfferResponses)
router.route('/get-interviewing-offers/:userId').get(getInterviewingOffers)

//Saved jobs
router.route('/saved-jobs').post(saveJob)

//Hire provider
router.route('/hire-provider').post(hireBidOffer)




export default router