import React, { useState } from 'react';
import { useChat } from './useChat';
import highlight_sample from './highlight_sample.json'
const colors = ["red", "yellow", "blue", "green", "purple", "orange"];
const styles = {
  conversationUI: {
    padding: '10px',
    height: '400px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  messages: {
    overflowY: 'auto',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    paddingRight: '10px', // Space for scrollbar
  },
  message: {
    padding: '8px 12px',
    borderRadius: '20px',
    margin: '5px',
    maxWidth: '75%', // Helps in text wrapping and maintaining bubble shape
    wordWrap: 'break-word', // Essential for line wrapping
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#dcf8c6',
    marginRight: '10px', // Space from the right edge
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
    marginLeft: '10px', // Space from the left edge
  },
  inputArea: {
    display: 'flex',
    marginTop: '10px',
  },
  input: {
    flexGrow: 1,
    marginRight: '5px',
    padding: '10px',
    borderRadius: '20px',
    border: '1px solid #ccc',
  },
  sendButton: {
    padding: '10px 20px',
    borderRadius: '20px',
    border: 'none',
    backgroundColor: '#007bff',
    color: 'white',
    cursor: 'pointer',
  },
};

// const ConversationUI = () => {
//   const { messages, sendMessage } = useChat();
//   console.log(messages)
//   const [inputText, setInputText] = useState('');
//   console.log(inputText)
//   const [highlightInput, setHighlightInput] = useState('');
//   console.log(highlightInput)

//   const handleSendMessage = (e) => {
//     e.preventDefault();
//     if (!inputText.trim()) return;
//     sendMessage(inputText);
//     console.log("nice")
//     setInputText('');
//   };
//   // Handler for highlight functionality
//   const handleHighlightText = (e) => {
//     e.preventDefault();
//     if (!highlightInput.trim()) return;
//     console.log("none")

//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//       chrome.tabs.sendMessage(tabs[0].id, { action: 'highlight', text: highlightInput }, (response) => {
//         console.log(response);
//       });
//     });

//     setHighlightInput(''); // Clear the highlight input after sending the text
//   };

//   return (
//     <div style={styles.conversationUI}>
// <div style={styles.messages}>
//   {messages.map((msg, index) => (
//     <div
//       key={index}
//       style={{
//         ...styles.message,
//         ...(msg.sender === 'user' ? styles.userMessage : styles.botMessage)
//       }}
//     >
//       {msg.text}
//     </div>
//   ))}
// </div>

//       <form onSubmit={handleSendMessage} style={styles.inputArea}>
//         <input
//           type="text"
//           value={inputText}
//           onChange={(e) => setInputText(e.target.value)}
//           placeholder="Type a message..."
//           style={styles.input}
//         />
//         <button type="submit" style={styles.sendButton}>Send</button>
//       </form>
//     </div>
//   );
// };

// export default ConversationUI

const ConversationUI = () => {
  const { messages, sendMessage } = useChat();
  const [inputText, setInputText] = useState('');

  const handleInput = (e) => {
    e.preventDefault();
    const trimmedInput = inputText.trim();
    if (!trimmedInput) return;

    // Check if the inputText starts with the "highlight:" command

    if (trimmedInput.toLowerCase().startsWith('highlight')) {
      // Extract the text to highlight after the "highlight:" command
      // const textToHighlight = trimmedInput.substring('highlight:'.length).trim();

      if (highlight_sample) {
        console.log("Text received", highlight_sample);

        // Iterate over each key in the highlight_sample object
        Object.keys(highlight_sample).forEach((topic, index) => {
          // Get the array of spans for the current topic
          const spans = highlight_sample[topic];
          const color = colors[index % colors.length]
          // Loop through each span in the current topic's array
          spans.forEach(span => {
            // Query the active tab in the current window
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
              console.log(tabs[0].id);

              // Send the individual span to the content script
              chrome.tabs.sendMessage(tabs[0].id, { action: 'highlight', text: span, color: color }, function (response) {
                console.log("Highlighting span:", span);
                console.log(response);
              });
            });
          });
        });
      }
    }
    else if (trimmedInput.toLowerCase().startsWith('remove highlight')) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        console.log(tabs[0].id);

        // Send the individual span to the content script
        chrome.tabs.sendMessage(tabs[0].id, { action: 'removehighlight' }, function (response) {
          console.log(response);
          console.log("remove highlight")
        });
      });
    }
    else {
      // It's not a highlight command, so treat it as a regular chat message
      sendMessage(trimmedInput);
    }

    setInputText(''); // Clear the input after handling the command or sending the message
  };

  return (
    <div style={styles.conversationUI}>
      <div style={styles.messages}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              ...(msg.sender === 'user' ? styles.userMessage : styles.botMessage)
            }}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleInput} style={styles.inputArea}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type 'highlight:{text}' to highlight or enter a message..."
          style={styles.input}
        />
        <button type="submit" style={styles.sendButton}>Send</button>
      </form>
    </div>
  );
};

export default ConversationUI;
