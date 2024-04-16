import React, { useState, useEffect } from 'react';
import { useChat } from './useChat';
import { fetchPostSummary } from './useChat';

const dummyPostText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam";

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
  summaryButton: {
    fontSize: '9px',
    marginLeft: '3px',
    marginTop: '3px',
    padding: '5px 10px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#00559a',
    color: 'white',
    cursor: 'pointer',
  },
  summaryText: {
    borderRadius: '5px',
    backgroundColor: '#ccd0fb',
    padding: '10px',
  },
};


const ConversationUI = () => {
  const { messages, sendMessage } = useChat();
  const [inputText, setInputText] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(inputText);
    setInputText('');
  };

  const loadSummary = (postText) => {
    const [summary, setSummary] = useState("Loading Summary!");

    fetchPostSummary(postText).then(function (response) {
      setSummary(response.message);
    });

    return summary;
  };

  return (
    <div style={styles.conversationUI}>
      {/* Summary of the post */}
      <div style={styles.summaryText}>
        <b>Summary of the post:</b>
        <br></br>
        {loadSummary(dummyPostText)}
      </div>
      <div>
        Do you think the summary is correct?
        <button style={styles.summaryButton}>
          Yes
        </button>
        <button style={styles.summaryButton}>
          No
        </button>
      </div>

      {/* Chat with AI */}
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
      <form onSubmit={handleSendMessage} style={styles.inputArea}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type a message..."
          style={styles.input}
        />
        <button type="submit" style={styles.sendButton}>Send</button>
      </form>
    </div>
  );
};

export default ConversationUI;