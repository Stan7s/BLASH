import React, { useEffect, useState } from 'react';
import './Popup.css';

export const getData = () => {
  const [postData, setPostData] = useState(null);
  const [textData, setTextData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Function to grab post data based on XPath
    const grabPostData = async () => {
      try {
        const tabs = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });
        const activeTab = tabs[0];
        const result = await chrome.scripting.executeScript({
          target: { tabId: activeTab.id },
          function: () => {
            const postElement = document.evaluate(
              '/html/body/shreddit-app/dsa-transparency-modal-provider/div/div[1]/div/main/shreddit-post/div[2]/div/div[1]',
              document,
              null,
              XPathResult.FIRST_ORDERED_NODE_TYPE,
              null
            ).singleNodeValue;
            return postElement ? postElement.textContent.trim() : null;
          },
        });
        setPostData(
          result[0].result ||
            'Either this post does not have any text or this is not a Reddit post. Please go to an actual Reddit post.'
        );
      } catch (error) {
        console.error('Error fetching post data:', error);
        setPostData('Error fetching post data.'); // Set error message for postData
      }
    };

    // Function to grab comments data based on XPath
    const grabTextData = async () => {
      try {
        const tabs = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });
        const activeTab = tabs[0];
        const result = await chrome.scripting.executeScript({
          target: { tabId: activeTab.id },
          function: () => {
            let comments = ''; // Variable to store concatenated comments

            // Iterate over the top 10 comments
            for (let i = 1; i <= 10; i++) {
              // Construct the XPath for each comment
              const xpath = `/html/body/shreddit-app/dsa-transparency-modal-provider/div/div[1]/div/main/div/faceplate-batch/shreddit-comment-tree/shreddit-comment[${i}]/div[3]`;

              // Find the paragraph element for the current comment
              const paragraphElement = document.evaluate(
                xpath,
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
              ).singleNodeValue;

              // If paragraphElement exists, append its text content to the comments string
              if (paragraphElement) {
                comments += paragraphElement.textContent.trim() + ' ';
              }
            }

            // Return the concatenated comments
            return comments.trim();
          },
        });
        setTextData(result[0].result || 'No comments found for this post.');
      } catch (error) {
        console.error('Error fetching comments data:', error);
        setTextData('Error fetching comments data.'); // Set error message for textData
      }
    };

    // Execute grabPostData and grabTextData functions when the component mounts
    grabPostData();
    grabTextData();
  }, []); // Run once on component mount

  return { postData, textData };
};
