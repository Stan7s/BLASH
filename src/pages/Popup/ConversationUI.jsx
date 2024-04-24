import React, { useEffect, useState } from 'react';
import { useChat } from './useChat';
import { fetchPostSummary, fetchPostHighlight, fetchDraft } from './useChat';
import { getData } from './getData';
import { useData } from './useData';
import { printLine } from '../Content/modules/print';

// const dummyPostText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam";
// import highlight_sample from './highlight_sample.json'
// const colors = ["red", "yellow", "blue", "green", "purple", "orange"];
const colors = ["#F2C6DE", "#FAEDCB", "#C6DEF1", "#C9E4DE", "#DBCDF0", "#D7F9C4"];
const baseButtonStyle = {
  fontSize: '9px',
  marginLeft: '3px',
  marginTop: '3px',
  padding: '5px 10px',
  borderRadius: '5px',
  border: 'none',
  backgroundColor: '#00CED1',
  color: 'white',
  cursor: 'pointer',
};

const styles = {
  conversationUI: {
    padding: '10px',
    height: '580px',
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
    flex: '1 0 40%',
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
    backgroundColor: 'rgba(0, 206, 209, 0.25)',
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
    backgroundColor: '#00CED1',
    color: 'white',
    cursor: 'pointer',
  },
  summaryButton: {
    ...baseButtonStyle,
    backgroundColor: '#00CED1',
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
    width: '50px',
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
  themeButtonContainer: {
    display: 'flex',
    flexWrap: 'wrap', // Allows items to wrap as needed
    padding: '1px', // Padding inside the container
    gap: '10px', // Space between buttons
  },
  themeButton: {
    fontSize: '10px', 
    flexGrow: 1,
    flexBasis: 'calc(50% - 5px)', // Calculate width to fit two items per row considering the gap
    height: 'auto', // Height based on content
    padding: '5px 5px', // Sufficient padding to handle text wrapping
    boxSizing: 'border-box', // Include padding and border in the element's total width and height
    overflow: 'hidden', // Hide overflowed content
    display: 'flex',
    alignItems: 'center', // Center text vertically
    justifyContent: 'center', // Center text horizontally
    textAlign: 'center',
    border: '1px solid #ccc', // Just to visualize boundaries
    borderRadius: '8px', // Rounded corners
    backgroundColor: '#f0f0f0', // Background color for visibility
    cursor: 'pointer',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out', // Animate transformations and shadow
  },
  themeButtonActive: {
    transform: 'scale(0.95)', // Slightly scale down when active
    boxShadow: '0 5px 15px rgba(0,0,0,0.2)', // Add shadow for depth
  },
  discussionDraftContainer: {
    maxHeight: '300px', // Set a maximum height that fits within your UI design
    overflowY: 'auto', // Enable vertical scrolling
    padding: '5px',
    backgroundColor: '#f8f8f8', // Optional: for better visibility
    borderRadius: '8px', // Optional: for aesthetics
    margin: '10px', // Optional: for spacing around the container
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)' // Optional: for aesthetics
  },
  contentContainer: {
    maxHeight: '0 0 30%',
    flex: '1 0 40%',
    overflowY: 'auto',  // Enable scrolling
    backgroundColor: '#f0f0f0',  // Light grey background
    padding: '10px',  // Padding around the content
    borderRadius: '8px',  // Rounded corners
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',  // Subtle shadow for depth
    margin: '10px 0',  // Vertical spacing
  },
  notification: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '10px 20px',
    borderRadius: '5px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
    zIndex: 1000, // Make sure it's on top of other elements
    color: 'white',
    textAlign: 'center',
  },
  notificationSuccess: {
      backgroundColor: '#9ACD32', // Green for success
  },
  notificationWarning: {
      backgroundColor: '#F4A460', // Orange for warning
  },
  menuButton: {
    fontSize: '12px', // Larger font size
    padding: '8px 16px',
    borderRadius: '10px',
    border: '1px solid #ccc',
    backgroundColor: '#f0f0f0',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  menuButtonActive: {
    backgroundColor: '#00CED1', // Blue background for active mode
    color: 'white',
  },
  menuContainer: {
    display: 'flex', // Arrange children in a row
    justifyContent: 'space-between', // Space out the buttons evenly
    padding: '10px', // Padding around the container
    borderBottom: '1px solid #ccc', // Optional: adds a separator line below the menu
  },  
  noButton: {
    ...baseButtonStyle, // Inherit styles from summaryButton
    backgroundColor: '#FA8072', // Light red
  },
  removeButton: {
    ...baseButtonStyle, // Inherit all styles from summaryButton
    backgroundColor: '#FA8072', // Red color for the remove button
    color: 'white',
  },
  generateButton: {
    ...baseButtonStyle, // Inherit all styles from summaryButton
    fontSize: '12px', // Smaller font size
    backgroundColor: '#00CED1', // Red color for the remove button
    color: 'white',
  },
  pasteButton: {
    ...baseButtonStyle, // Inherit all styles from summaryButton
    fontSize: '12px', // Smaller font size
    backgroundColor: '#9ACD32', // Red color for the remove button
    color: 'white',
  },
  // highlightToggleSwitchContainer: {
  //   position: 'absolute',
  //   top: '10px',
  //   right: '10px',
  //   zIndex: 10, // Ensure it is above other content if necessary
  // },
  contentContainer: {
    maxHeight: '0 0 50%',
    overflowY: 'auto', 
    backgroundColor: '#f0f0f0', 
    padding: '2px 2px 2px 2px', // Ensure padding is sufficient on all sides
    borderRadius: '8px', 
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)', 
    margin: '10px 0', 
    position: 'relative', // Required for absolute positioning of children
  },
  highlightContainer: {
    display: 'flex',
    alignItems: 'center', // Align items vertically in the center
    justifyContent: 'space-between', // Space out the toggle and text
    padding: '2px', // Padding around the container for some space
    position: 'relative', // For positioning the toggle absolutely if needed
  },
  highlightText: {
    width: '80%', // Assign 80% width to the text
    marginRight: '5px', // Optional: adds some spacing between text and toggle
  },
  highlightToggleSwitchContainer: {
      width: '20%', // Assign 20% width to the toggle switch container
      display: 'flex', // Use flex to center the toggle switch within this container
      justifyContent: 'flex-end', // Align the toggle switch to the right
  },
  no_indent: {
    marginLeft: '0px',
  },
};

const ConversationUI = () => {
  const { messages, sendMessage } = useChat();
  const [inputText, setInputText] = useState('');

  const { postData, textData } = useData();
  const [summary, setSummary] = useState('Loading Summary...');
  const [highlight_sample, sethighlight_sample] = useState({});

  const [isHighlighted, setIsHighlighted] = useState(false);
  const [mode, setMode] = useState('summary'); // Track display mode

  const [activeButton, setActiveButton] = useState(null);

  const [discussionPoints, setDiscussionPoints] = useState([]);
  const [notification, setNotification] = useState({ message: '', visible: false, type: 'success' });






    // Load summary once postData is available
  useEffect(() => {
    if (postData) {
      fetchPostSummary(postData).then(response => {
        setSummary(response.message);
      });
      fetchPostHighlight(postData).then(highlightedJson => {
        sethighlight_sample(highlightedJson);
        console.log("Highlight Sample Updated:", highlightedJson);
      }).catch(error => {
        console.error("Failed to fetch highlights", error);
      });
    }
  }, [postData]); // Dependency on postData to fetch summary
  
  const toggleSwitchLabelStyle = {
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: isHighlighted ? '#4CAF50' : '#ccc', // Green when on
    transition: '.4s',
    borderRadius: '20px',
    display: 'flex',
    justifyContent: 'space-between', // Ensures the text and the slider are spaced out evenly
    alignItems: 'center', // Centers vertically
    padding: '0 10px', // Gives some padding to prevent text touching the edges
  };

  const toggleSwitchSliderStyle = {
    position: 'absolute',
    top: '1px', // Adjust top positioning to center
    left: isHighlighted ? '31px' : '2px', // Adjust left positioning for smooth toggle
    width: '18px', // Slightly larger for better visibility
    height: '18px', // Same as width for a perfect circle
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
          console.log("ConversationUI.jsx: remove highlight")
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
    sendMessage(inputText, inputText, postData);
    setInputText('');
  };

  // const loadSummary = (postText) => {
  //   const [summary, setSummary] = useState('Loading Summary!');

  //   fetchPostSummary(postText).then(function (response) {
  //     setSummary(response.message);
  //   });

  //   return summary;
  // };
  const handleModeChange = (mode) => {
    setMode(mode);
    // if (mode === 'highlight') {
    //   if (Object.keys(highlight_sample).length > 0) { // Check if highlight_sample is populated
    //     setIsHighlighted(false);
    //     handleHighlightToggle();
    //   } else {
    //     console.log('Highlight data is not ready yet.');
    //     // Optionally, revert the mode switch or show a notification
    //   }
    //   // setIsHighlighted(true);
    //   // handleHighlightToggle();
    // } else {
    //   setIsHighlighted(false);
    //   handleHighlightToggle();
    // }
  };

  const handleThemeButtonClick = (theme, index) => {
    setActiveButton(index); // Set the active button
    
    const displayMessage = theme;
    const backendMessage = `Explain “${theme}” in the post. 
    Desired output should be: A short paragraph explaining the topic:`

    sendMessage(displayMessage, backendMessage, postData); // Send the theme as a message

    setTimeout(() => {
      setActiveButton(null); // Reset the active button state after the animation
    }, 200); // Match this with the CSS transition duration
  };

  const addDiscussionPoint = (message) => {
    setDiscussionPoints(currentPoints => {
        // Check if the message already exists in the discussion points
        if (currentPoints.includes(message)) {
            showNotification('This discussion point has already been added', 'warning'); // Warn user
            return currentPoints; // Return current list without adding duplicate
        } else {
            // Add new discussion point if not already in the list
            showNotification('Point added!'); // Show success message
            return [...currentPoints, message];
        }
    });
};

  const removeDiscussionPoint = (indexToRemove) => {
    setDiscussionPoints(currentPoints => currentPoints.filter((_, index) => index !== indexToRemove));
    showNotification('Point removed.'); 
  };
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type, visible: true });

    setTimeout(() => {
        setNotification({ message: '', type: 'success', visible: false });
    }, 1000); // Message will disappear after 3000 milliseconds (3 seconds)
  };

  const generateDraft = () => {
    console.log(postData);
    console.log(discussionPoints);
    // fetchDraft(postData, discussionPoints).then(response => {
    //       console.log(response);
    // });

    let instruction = "Below is a list of message history called 'Draft Bucket List'. Your goal is to utilize these information in draft bucket list to draft the full response to the Redit post. Please give the draft full response to the post. Return the response text only."
    
    let draft_bucketlist = "Draft bucket list:" + discussionPoints;
    let prompt = instruction + "\n" + draft_bucketlist;
    console.log("Prompt:", prompt)

    sendMessage("Generate Draft", prompt, postData);
    showNotification('Draft generated successfully!'); 
  };



  const pasteDraft = () => {
    // Get the last message from the chat
    const latestMessage = messages[messages.length - 1].text;
    // const latestMessage = "Hello worldd";
    console.log("latest message:", latestMessage);
    // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    //   console.log("ID:", tabs[0].id);
    //   chrome.tabs.sendMessage(tabs[0].id, { action: 'pasteDraft', text: latestMessage}, function (response) {
    //     console.log(response);
    //   });
    // });
    navigator.clipboard.writeText(latestMessage).then(function() {
        console.log('Text successfully copied to clipboard');
    }).catch(function(err) {
        console.error('Could not copy text: ', err);
    });

    showNotification('Draft copied successfully! Now click on the comment box and paste the draft.'); 
  };




  return (
    <div style={styles.conversationUI}>
      {notification.visible && (
          <div style={{
              ...styles.notification,
              ...(notification.type === 'success' ? styles.notificationSuccess : styles.notificationWarning)
          }}>
              {notification.message}
          </div>
      )}



      {/* Menu with Summary and Highlight buttons */}
      <div style={styles.menuContainer}>
        <button onClick={() => handleModeChange('summary')} 
          style={mode === 'summary' ? { ...styles.menuButton, ...styles.menuButtonActive } : styles.menuButton}>
          Summary
        </button>
        <button onClick={() => handleModeChange('highlight')} 
          style={mode === 'highlight' ? { ...styles.menuButton, ...styles.menuButtonActive } : styles.menuButton}>
          Highlight
        </button>
        <button onClick={() => handleModeChange('drafting')} 
          style={mode === 'drafting' ? { ...styles.menuButton, ...styles.menuButtonActive } : styles.menuButton}>
          Draft
        </button>
      </div>



      {/* Conditional rendering based on selected mode */}
      {mode === 'summary' && (
        <div style={styles.contentContainer}>
          <b>Post summary:</b> {summary}
          <br></br>
          {/* Do you think the summary is correct?
          <button style={styles.summaryButton}>Yes</button>
          <button style={styles.noButton}>No</button> */}
        </div>
      )}

      {mode === 'highlight' && (
          <div style={styles.contentContainer}>
              <div style={styles.highlightContainer}>
                  <p style={styles.highlightText}>
                      The post has several key themes. Quotes from the original post are highlighted, color corresponding to the themes.
                  </p>
                  <div style={styles.highlightToggleSwitchContainer}>
                      <div style={styles.toggleSwitch}>
                          <input
                              id="highlight-toggle"
                              style={styles.toggleSwitchCheckbox}
                              className="toggle-switch-checkbox"
                              type="checkbox"
                              checked={isHighlighted}
                              onChange={handleHighlightToggle}
                          />
                          <label style={toggleSwitchLabelStyle} htmlFor="highlight-toggle">
                              <span style={{ position: 'absolute', left: '4px', transition: '.4s', opacity: isHighlighted ? 1 : 0 }}>HL</span>
                              <span style={toggleSwitchSliderStyle}></span>
                              <span style={{ position: 'absolute', right: '4px', transition: '.4s', opacity: isHighlighted ? 0 : 1 }}>OFF</span>
                          </label>
                      </div>
                  </div>
              </div>
              <div style={styles.themeButtonContainer}>
                  {Object.keys(highlight_sample).map((topic, index) => (
                      <button 
                          key={index} 
                          onClick={() => handleThemeButtonClick(topic, index)} 
                          style={{ 
                              ...styles.themeButton, 
                              backgroundColor: colors[index % colors.length],
                              ...(activeButton === index ? styles.themeButtonActive : {})
                          }}>
                          {topic}
                      </button>
                  ))}
              </div>
          </div>
      )}



      
      {mode === 'drafting' && (
        <div style={styles.contentContainer}>
          <button onClick={() => generateDraft()}
                        style={styles.generateButton}>Generate draft</button>
          <button onClick={() => pasteDraft()}
                        style={styles.pasteButton}>Copy draft</button>
           {/* <button onClick={() = pasteDraft()} */}
                        {/* style={styles.pasteButton}>Use</button> */}
          <h3>Discussion History</h3>
          <ul>
            {discussionPoints.map((point, index) => (
              <li class="no_indent" key={index}>
                {point}
                <button onClick={() => removeDiscussionPoint(index)} 
                        style={styles.removeButton} 
                        aria-label={`Remove discussion point: ${point}`}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}


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
            {msg.selectable && (
                <button onClick={() => addDiscussionPoint(msg.text)} style={styles.summaryButton}>
                    Good point
                </button>
            )}
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
    </div>
  );
};

export default ConversationUI;
