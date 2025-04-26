import express from 'express'
import { chatWithGemini } from '../controllers/AssistiveFixNavigatorModule/chat.controller.js'
const router = express.Router()

router.route('/chat').post(chatWithGemini)

export default router