require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

const allowedOrigins = ["https://personal-injury-form.vercel.app/", "http://localhost:5500"];
app.use(cors({
  origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
      } else {
          callback(new Error("CORS not allowed"));
      }
  },
  credentials: true
}));
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post("/api/chatbot", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        max_tokens: 100,
        messages: [
          {
            role: "system",
            content: `You are an expert at accident claim compensation.
                  Your goal is to help users determine how much they can get in compensation.
                  Guidelines:
                  - Encourage users to proceed with their claim.
                  - Explain that time is limited to file a claim after an accident.
                  - Emphasize "No Win, No Fee - Guaranteed".
                  - Help users complete the 30-second survey.
                  
                  Questions you may ask:
                  1. What type of accident were you in?
                      - Car accident, Motorcycle accident, Ride share accident, Commercial vehicle accident,
                        Semi-truck accident, Bicycle or pedestrian accident, Dog bite, Injury on commercial property.
                  2. How were you hurt?
                      - Fatality or Wrongful Death, Major Injury (Broken Bones, Fractures, Organ Damage, Concussion),
                        Moderate Injury (Neck or Back Pain, Sprains, Whiplash), Non-Physical Injury.
                  3. Was the accident your fault?
                      - Yes, No.

                  If a user is hesitant, reassure them that this is a free case evaluation.
                  If they ask how much they can get, mention that it depends on the details of their case,
                  but they should continue to find out.`,
          },
          { role: "user", content: userMessage },
        ],
      }),
    });

    const data = await response.json();
    res.json({ response: data.choices[0].message.content });
  } catch (error) {
    console.error("Error fetching from OpenAI:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = app;
