import { useState } from 'react';
import { GPT_API_KEY } from '../../../secrets.api.js';

console.log(GPT_API_KEY); // Use your API key securely

const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: GPT_API_KEY,
    dangerouslyAllowBrowser: true
});

const initialdraftprompt = async (userMessage) => {
    let prompt = "Pretend to be an assistant who helps users to draft responses for mental health posts on social media community. So the user would be someone that will help the posters (who post about their issues) by providing empathetic responses. The response should not be long. The AI assistant will have some features including highlighting important parts about the posts, For each feature, they can interact more with the assistant to come with different 'draft responses'. If user satisfy with recommended responses, they will choose to add the response to 'Draft Bucket List'. The goal of AI assistant is to utilize these information in draft bucket list to draft the full response to the post. Please give the draft full response to the post. The desired output format should be: {'Post:' {POST}; 'Draft Bucket List from assistant': {DRAFT_BUCKET_LIST}'}";
};

// Generate response draft
const generateDraft = async (userMessage) => {
    let prompt = "Pretend to be an assistant who helps users to draft responses for mental health posts on social media community. So the user would be someone that will help the posters (who post about their issues) by providing empathetic responses. The response should be based on previous conversation between you and the user. Please give the draft full response to the post. The response should not be long (less than 200 words). The desired output should be {'Response':FULL_RESPONSE}.";
    try {
        console.log("Sending message to GPT-3.5:", userMessage)
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt}],
            temperature: 0.5,
            max_tokens: 1000,
        });
        console.log("Response from GPT-3.5:", response.choices[0].message.content);
        choice_prompt = "Is this response good?";
        return { message: response.choices[0].message.content};
    } catch (error) {
        console.error("Error sending message to GPT-3.5:", error);
        return { message: "Error processing your request. Please try again." + error };
    }
};

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
            return { message: response.choices[0].message.content + "!!!!" };
        } catch (error) {
            console.error("Error sending message to GPT-3.5:", error);
            return { message: "Error processing your request. Please try again." + error };
        }
    };

    export const useChat = () => {
        const [messages, setMessages] = useState([]);

        const sendMessage = async (userMessage) => {
            setMessages(currentMessages => [...currentMessages, { sender: 'user', text: userMessage }]);
            
            console.log("userMessage:", userMessage)
            if (userMessage === "Generate draft") {
                console.log("Generating draft...")
                const backendResponse = await generateDraft(userMessage);
                if (backendResponse && backendResponse.message) {
                    setMessages(currentMessages => [...currentMessages, { sender: 'bot', text: backendResponse.message }]);
                }
            }
            else{
                const backendResponse = await sendMessageToBackend(userMessage);
                if (backendResponse && backendResponse.message) {
                    setMessages(currentMessages => [...currentMessages, { sender: 'bot', text: backendResponse.message }]);
                }
            }
        };

        return { messages, sendMessage };
    };