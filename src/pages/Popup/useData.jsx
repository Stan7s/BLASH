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
                      comments += "Comment " + i.toString() + ": " + paragraphElement.textContent.trim() + '\n';
                    }
                  }
      
                  // Return the concatenated comments
                  return comments.trim();
                },
              });
              setTextData(result[0].result || 'No comments found for this post.');
            //   console.log("Comments arre", result[0].result || 'No comments found for this post.')
            } catch (error) {
              console.error('Error fetching comments data:', error);
              setTextData('Error fetching comments data.'); // Set error message for textData
            }
        };

        fetchData();
        grabTextData();
    }, []);
    // console.log("textData", textData)
    return { postData, textData, isLoading: !postData && !textData };
};
