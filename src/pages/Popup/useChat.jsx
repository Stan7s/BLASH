import { useState } from 'react';
import { GPT_API_KEY } from '../../../secrets.api.js';

console.log(GPT_API_KEY); // Use your API key securely

const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: GPT_API_KEY,
    dangerouslyAllowBrowser: true
});

export const fetchPostSummary = async (postText) => {
    let prompt = "You are an empathical AI assistant. Summarize the post with less than 60 words. Post:" + postText;
    try {
        console.log("Sending post to GPT-3.5:", prompt)
        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo",
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

// export const fetchDraft = async (postText, discussionPoints) => {
//     let instruction = "Pretend to be an assistant who helps users to draft responses for mental health posts on social media community. So the user would be someone that will help the posters (who post about their issues) by providing empathetic responses. The response should not be long. The AI assistant will have some features including highlighting important parts about the posts, For each feature, they can interact more with the assistant to come with different 'draft responses'. If user satisfy with recommended responses, they will choose to add the response to 'Draft Bucket List'. The goal of AI assistant is to utilize these information in draft bucket list to draft the full response to the post. Please give the draft full response to the post"
    
//     let post = "Post:" + postText;
//     let draft_bucketlist = "Draft bucket list:" + discussionPoints;
//     let prompt = instruction + "\n" + post + "\n" + draft_bucketlist;
//     console.log("Prompt:", prompt)

//     try {
//         console.log("Sending post to GPT-3.5:", prompt)
//         const response = await openai.chat.completions.create({
//             model: "gpt-3.5-turbo",
//             messages: [{ role: "user", content: prompt }],
//             temperature: 0,
//             max_tokens: 1000,
//         });
//         console.log("Draft from GPT-3.5:", response.choices[0].message.content)
//         return { message: response.choices[0].message.content};
//     } catch (error) {
//         console.error("Error sending message to GPT-3.5:", error);
//         return { message: "Error processing your request. Please try again." + error };
//     }
// }

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
    let prompt = `Given the following post, find a list of main topics from the post and identify exact spans from the post by those relevant topics. 
    Desired json output format should have key as the specific topic and value is a list of relevant spans to that topic: 
    {"topic": ["span 1.1", "span 1.2", …], "topic": ["span 2.1", "span 2.2", …], …} \n` + postText;
    
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

export const fetchCommentsHighlight = async (commentText) => {
    let prompt = `Below are the top 10 comments for the post. Summarize the comments into topics and 
    provide details regarding how each topic is covered by the comments. 
    Return a json objective where the key is the topic and the value is the detail how the topic is covered by the comments:
    {"Topic 1": "Details 1", "Topic 2": "Details 2", …}. Each detail should not be more than 40 words\n` + commentText;
    
    try {
        console.log("Getting Comments Topics:", prompt)
        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [{ role: "user", content: prompt }],
            temperature: 0,
            max_tokens: 1000,
        });
        console.log("Comments Highlights by GPT:", response.choices[0].message.content)
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