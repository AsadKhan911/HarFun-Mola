import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export const chatWithGemini = async (req, res) => {
  const { messages } = req.body; // [{ role: "user", content: "My AC isn't cooling." }]

  try {
    // Add a system instruction first
    const systemInstruction = {
      role: "model",
      parts: [
        {
          text: `
You are AssistiveFix, a smart repair assistant inside Harfun-Mola app. 
Your job is to:
- Greet the user with "Assalam-o-Alaikum Welcome to Harfun Mola!" at the beginning of the conversation.
- Help users diagnose household product issues (e.g., AC, Fridge, Microwave).
- Ask simple follow-up questions if needed.
- Based on user answers, guess the most likely issue.
- Suggest appropriate service type (like 'AC Gas Leak Repair' or 'Microwave Magnetron Replacement').
- Keep the conversation simple, friendly, and short.
- Only suggest services available from user's app database (you will be given service names soon).
- If you are suggesting a service, ask the user if they would like to know how to book it, rather than asking them to book it directly.
If you don't know something, politely say you are not sure and recommend booking a diagnosis.
`
        }
      ]
    };

    // Convert user messages
    const formattedMessages = messages.map(m => ({
      role: m.role, // "user" or "model"
      parts: [{ text: m.content }]
    }));

    // Attach system instruction at the beginning
    const fullMessages = [systemInstruction, ...formattedMessages];

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: fullMessages,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const reply = response.data.candidates[0]?.content?.parts[0]?.text || 'No response from Gemini';

    res.json({ reply });

  } catch (error) {
    console.error('Gemini error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Something went wrong with Gemini.' }); // Fixed here
  }
};
