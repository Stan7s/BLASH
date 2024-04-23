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

        fetchData();
    }, []);

    return { postData, textData, isLoading: !postData && !textData };
};
