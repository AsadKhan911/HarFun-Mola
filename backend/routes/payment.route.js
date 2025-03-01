import express from 'express'
const router = express.Router()

import { createPaymentIntent, 
    capturePayment, 
    cancelPayment, 
    transferFunds, 
    deleteConnectedAccount, checkBalance } from '../controllers/payments.controller.js'

router.route('/create-payment-intent').post(createPaymentIntent)
router.route('/capture-payment').post(capturePayment)
router.route('/cancel-payment').post(cancelPayment)
router.route('/transfer-payment').post(transferFunds)
router.route('/delete-connected-account').post(deleteConnectedAccount)
router.route('/balance').get(checkBalance)


export default router