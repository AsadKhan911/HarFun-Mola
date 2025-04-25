import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export const chatWithGPT = async (req, res) => {
  const { messages } = req.body; // [{ role: "user", content: "My AC isn't cooling." }]

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPEN_AI_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const reply = response.data.choices[0].message.content;
    res.json({ reply });

  } catch (error) {
    console.error('GPT error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Something went wrong with GPT.' });
  }
};
