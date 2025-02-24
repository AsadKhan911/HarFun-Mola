import express from 'express'
const router = express.Router()

import {createPaymentIntent, capturePayment, cancelPayment, transferToServiceProvider} from '../controllers/payments.controller.js'

router.route('/create-payment-intent').post(createPaymentIntent)
router.route('/capture-payment').post(capturePayment)
router.route('/cancel-payment').post(cancelPayment)
router.route('/transfer-payment').post(transferToServiceProvider)


export default router