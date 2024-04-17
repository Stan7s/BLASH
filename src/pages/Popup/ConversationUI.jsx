import React, { useEffect, useState } from 'react';
import { useChat } from './useChat';
import { fetchPostSummary } from './useChat';
import { getData } from './getData';

// const dummyPostText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam";
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
  // New styles for the toggle switch container
  toggleSwitchContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'absolute', // Position it absolutely within the parent
    top: '10px', // At the top of the parent container
    right: '10px', // At the right of the parent container
    padding: '5px', // Smaller padding to mak
  },
  // Add to your existing styles object
  toggleSwitch: {
    position: 'relative',
    display: 'inline-block',
    width: '40px',
    height: '20px',
    margin: '0', // Adjust as needed
  },
  toggleSwitchCheckbox: {
    opacity: 0,
    width: 0,
    height: 0,
  },
  toggleTextLabel: {
    marginRight: '10px', // Space between the text label and the toggle
    fontSize: '12px', // Adjust text size as needed
  },
  toggleSwitchLabel: {
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ccc',
    transition: '.4s',
    borderRadius: '20px',
  },
  toggleSwitchInner: {
    // Inner styles if needed
  },
  toggleSwitchSlider: {
    position: 'absolute',
    content: '""',
    height: '18px',
    width: '18px',
    left: '4px',
    bottom: '1px',
    backgroundColor: '#fff',
    transition: '.4s',
    borderRadius: '50%',
  },
};

const ConversationUI = () => {
  const { messages, sendMessage } = useChat();
  const [inputText, setInputText] = useState('');
  const { postData, textData } = getData();
  const [isHighlighted, setIsHighlighted] = useState(false);
  const toggleSwitchLabelStyle = {
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: isHighlighted ? '#4CAF50' : '#ccc', // Green when on
    transition: '.4s',
    borderRadius: '34px',
  };

  const toggleSwitchSliderStyle = {
    position: 'absolute',
    top: '4px',
    left: isHighlighted ? '25px' : '4px', // Move right when on
    width: '13px',
    height: '13px',
    backgroundColor: '#fff',
    borderRadius: '50%',
    transition: '.4s',
  };
  const handleHighlightToggle = () => {
    if (!isHighlighted) {
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
    else {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        console.log(tabs[0].id);

        // Send the individual span to the content script
        chrome.tabs.sendMessage(tabs[0].id, { action: 'removehighlight' }, function (response) {
          console.log(response);
          console.log("remove highlight")
        });
      });
    }
    // Add your logic to handle highlight toggling
    setIsHighlighted(!isHighlighted);
    console.log('Toggle Highlight State:', !isHighlighted); // Add this
  };
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(inputText);
    setInputText('');
  };

  const loadSummary = (postText) => {
    const [summary, setSummary] = useState('Loading Summary!');

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
        {loadSummary(postData)}
      </div>
      <div>
        Do you think the summary is correct?
        <button style={styles.summaryButton}>Yes</button>
        <button style={styles.summaryButton}>No</button>
      </div>

      {/* Chat with AI */}
      <div style={styles.messages}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              ...(msg.sender === 'user'
                ? styles.userMessage
                : styles.botMessage),
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
        <button type="submit" style={styles.sendButton}>
          Send
        </button>
      </form>
      <div style={styles.toggleSwitchContainer}>
        <label style={styles.toggleTextLabel}>Highlighting</label>
        <div style={styles.toggleSwitch}>
          <input
            id="highlight-toggle"
            style={styles.toggleSwitchCheckbox}
            className="toggle-switch-checkbox" // use className for CSS styles if needed
            type="checkbox"
            checked={isHighlighted}
            onChange={handleHighlightToggle}
          />
          <label
            style={toggleSwitchLabelStyle}
            htmlFor="highlight-toggle"
          >
            <span style={toggleSwitchSliderStyle}></span>
            {/* <span style={styles.toggleSwitchInner} /> */}
            {/* <span style={styles.toggleSwitchSlider} /> */}
          </label>
        </div>
      </div>
    </div>
  );
};

export default ConversationUI;
