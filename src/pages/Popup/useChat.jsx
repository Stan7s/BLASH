import { useState } from 'react';
import { GPT_API_KEY } from '../../../secrets.api.js';

console.log(GPT_API_KEY); // Use your API key securely

const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: GPT_API_KEY,
    dangerouslyAllowBrowser: true
});

export const fetchPostSummary = async (postText) => {
    let prompt = "Summarize the following text: " + postText;
    try {
        console.log("Sending post to GPT-3.5:", prompt)
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            temperature: 0,
            max_tokens: 1000,
        });
        console.log("Response from GPT-3.5:", response.choices[0].message.content)
        return { message: response.choices[0].message.content};
    } catch (error) {
        console.error("Error sending message to GPT-3.5:", error);
        return { message: "Error processing your request. Please try again." + error };
    }
}

function extractJSON(responseString) {
    try {
      // This regular expression assumes the JSON object starts with '{' and ends with '}'
      // and does not contain any curly braces in keys or values outside of the JSON structure.
      const jsonPattern = /{.*}/s;
      const match = responseString.match(jsonPattern);
  
      if (match) {
        // Convert the JSON string to a JavaScript object
        const jsonObject = JSON.parse(match[0]);
        console.log("Extracted JSON:", jsonObject);
        return jsonObject;
      } else {
        console.log("No JSON object found in the response.");
        return null;
      }
    } catch (error) {
      console.error("Failed to parse JSON from response:", error);
      return null;
    }
  }
  

export const fetchPostHighlight = async (postText) => {
    let prompt = `Read the following post and extract spants from the post  
    by topics. Generate a list of topics {topic_1, topic_2, ...} 
    and group spans by those relevant topics. 
    Desired json output format should be: 
    {"topic": ["span1.1", "span1.2", …], "topic": ["span2.1", "span2.2", …], …} \n` + postText;
    
    try {
        console.log("Getting Highlights:", prompt)
        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [{ role: "user", content: prompt }],
            temperature: 0,
            max_tokens: 1000,
        });
        console.log("Highlights GPT-3.5:", response.choices[0].message.content)
        return extractJSON(response.choices[0].message.content);
    } catch (error) {
        console.error("Error sending message to GPT-3.5:", error);
        return { message: "Error processing your request. Please try again." + error };
    }
}

const sendMessageToBackend = async (userMessage, conversationHistory, postText) => {
    const persona = `You are a helpful and empathetic assistant that 
    helps users provide meaningful responses to help-seeking posts on social media. 
    The user is currently interested in responding to this following post:\n ${postText}.\n 
    Make your responses to user's messages short but also meaningful and informative if necessary. 
    Don't use more than 40 words`
    try {
        console.log("Sending message to GPT-3.5:", userMessage)
        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [
                {role: "system", content: persona},
                ...conversationHistory, 
                { role: "user", content: userMessage }],
            temperature: 0,
            max_tokens: 1000,
        });
        console.log("Response from GPT-3.5:", response.choices[0].message.content)
        return { message: response.choices[0].message.content };
    } catch (error) {
        console.error("Error sending message to GPT-3.5:", error);
        return { message: "Error processing your request. Please try again." + error };
    }
};

export const useChat = () => {
    const [messages, setMessages] = useState([]);

    const sendMessage = async (userMessage, backendMessage=userMessage, postText) => {
        // Update UI with user's message
        setMessages(currentMessages => [...currentMessages, { sender: 'user', text: userMessage }]);

        // Prepare conversation history for the API
        const conversationHistory = messages.map(msg => ({ 
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text 
        }));
        
         // Send the message along with the history to the backend
        const backendResponse = await sendMessageToBackend(backendMessage, conversationHistory, postText);
        if (backendResponse && backendResponse.message) {
            setMessages(currentMessages => [...currentMessages, { sender: 'bot', text: backendResponse.message, selectable: true  }]);
        }
    };
    
        return { messages, sendMessage };
    };