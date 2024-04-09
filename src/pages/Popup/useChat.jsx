import { useState } from 'react';
import { GPT_API_KEY } from '../../../secrets.api.js';

console.log(GPT_API_KEY); // Use your API key securely

const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: GPT_API_KEY,
  dangerouslyAllowBrowser: true
});

const sendMessageToBackend = async (userMessage) => {
    try {
        console.log("Sending message to GPT-3.5:", userMessage)
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: userMessage }],
            temperature: 0,
            max_tokens: 1000,
          });
        console.log("Response from GPT-3.5:", response.choices[0].message.content)
        return { message: response.choices[0].message.content + "!!!!"};
    } catch (error) {
        console.error("Error sending message to GPT-3.5:", error);
        return { message: "Error processing your request. Please try again." + error };
    }

    // try {
    //     print("123")
    //     console.log("Sending message to GPT-3.5:", userMessage)
    //     // Simulated delay to mimic API call
    //     return new Promise(resolve => {
    //         setTimeout(() => resolve({ message: `Echo: ${userMessage + "!"}` }), 500);
    //     });
    // } catch (error) {
    //     console.error("Error sending message to backend:", error);
    //     return { message: "Error processing your request. Please try again." };
    // }
};

export const useChat = () => {
    const [messages, setMessages] = useState([]);

    const sendMessage = async (userMessage) => {
        setMessages(currentMessages => [...currentMessages, { sender: 'user', text: userMessage }]);

        const backendResponse = await sendMessageToBackend(userMessage);
        if (backendResponse && backendResponse.message) {
            setMessages(currentMessages => [...currentMessages, { sender: 'bot', text: backendResponse.message }]);
        }
    };

    return { messages, sendMessage };
};