import { useEffect, useState } from 'react';

export const useData = () => {
    const [postData, setPostData] = useState(null);
    const [textData, setTextData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
                const activeTab = tabs[0];
    
                // Execute script to fetch post content
                const postContentResult = await chrome.scripting.executeScript({
                    target: { tabId: activeTab.id },
                    function: () => {
                        let content = '';
                        const nodes = document.evaluate(
                            "//div[contains(@class, 'text-neutral-content') and @slot='text-body']//p",
                            document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null
                        );
    
                        for (let i = 0; i < nodes.snapshotLength; i++) {
                            content += nodes.snapshotItem(i).textContent + '\n';
                        }
                        return content;
                    },
                });
    
                // Set post data
                setPostData(postContentResult[0].result || 'No content found.');
    
            } catch (error) {
                console.error('Error fetching post data:', error);
                setPostData('Error fetching post data.');
            }
        };


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
                      let comments = '';
      
                      // Find all comment elements
                      const commentElements = document.querySelectorAll('shreddit-comment');
      
                      // Iterate over each comment element
                      commentElements.forEach((commentElement, index) => {
                          // Find the paragraph element within the comment element
                          const paragraphElement = commentElement.querySelector('.md');
      
                          // If paragraphElement exists, append its text content to the comments string
                          if (paragraphElement) {
                              comments += `Comment ${index + 1}: ${paragraphElement.textContent.trim()}\n`;
                          }
                      });
      
                      // Return the concatenated comments
                      return comments.trim();
                  },
              });
              setTextData(result[0].result || 'No comments found for this post.');
          } catch (error) {
              console.error('Error fetching comments data:', error);
              setTextData('Error fetching comments data.');
          }
        };


        fetchData();
        grabTextData();
    }, []);
    // console.log("textData", textData)
    return { postData, textData, isLoading: !postData && !textData };
};
