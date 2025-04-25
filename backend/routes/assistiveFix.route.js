import express from 'express'
import { chatWithGPT } from '../controllers/AssistiveFixNavigatorModule/chat.controller.js'
const router = express.Router()

router.route('/chat').post(chatWithGPT)

export default router