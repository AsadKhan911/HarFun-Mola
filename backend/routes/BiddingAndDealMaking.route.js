import express from 'express'
const router = express.Router()

// import {   multipleImageUpload  } from '../middlewares/multer.js'
import isAuthenticated from '../middlewares/isAuthenticated.js'
import { createBid, deleteBid, editBid, getBidById, getBids, getBidsByCustomer } from '../controllers/BiddingModule/BidController.js'
import { placeBidOffer, getBidOffersByBidId, getAllBidOffersForUser } from '../controllers/BiddingModule/PlaceBidController.js'
import { completeJobById, getAllJobsPostedByUser, saveJob, updateJobById } from '../controllers/BiddingModule/MyJobs.js'
import {
    acceptBidOffer,
    getAgreedContractsForProvider,
    getCompletedContractsForProvider,
    getInterviewingOffers,
    getProviderOfferResponses,
    hireBidOffer,
    rejectBidOffer,
    updateContractStatus
} from '../controllers/BiddingModule/Contract.controller.js'

router.route('/post-bid').post(isAuthenticated, createBid)
router.route('/get-bid').get(getBids)
router.route('/get-customer-bids').get(getBidsByCustomer)
router.route('/get-bid-ById').get(getBidById)
router.route('/edit-bid').patch(editBid)
router.route('/delete-bid').delete(deleteBid)

//Place bid by service provider
router.route('/place-bid').post(isAuthenticated, placeBidOffer)
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
router.route('/update-contract-status/:bidId').put(updateContractStatus)
router.route('/get-agreed-contract/:serviceProviderId').get(getAgreedContractsForProvider)
router.route('/get-completed-contract/:serviceProviderId').get(getCompletedContractsForProvider)

//Saved jobs
router.route('/saved-jobs').post(saveJob)

//Hire provider
router.route('/hire-provider').post(hireBidOffer)

//update job status
router.route('/complete-job').post(completeJobById)

export default router