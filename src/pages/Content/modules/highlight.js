// modules/highlight.js
export const highlightText = (textToHighlight, colorToHighlight) => {
    // Escape special characters for use in a regular expression
    const escapedText = textToHighlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Use a TreeWalker to iterate through text nodes
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );

    // Create a span to use for highlighting matches
    const highlightSpan = document.createElement('span');
    highlightSpan.style.backgroundColor = colorToHighlight;
    highlightSpan.className = 'highlight';
    let node;
    // Iterate through the text nodes
    while ((node = walker.nextNode())) {
        // Check if the text node contains the search text
        if (node.nodeValue.toLowerCase().includes(textToHighlight.toLowerCase())) {
            // Create a fragment to hold the new nodes
            const frag = document.createDocumentFragment();
            let lastIdx = 0;
            node.nodeValue.split(new RegExp(`(${escapedText})`, 'i')).forEach((part, idx) => {
                if (idx % 2 === 0) { // This is not the search text
                    frag.appendChild(document.createTextNode(part));
                } else { // This is the search text
                    const match = highlightSpan.cloneNode();
                    match.textContent = part;
                    frag.appendChild(match);
                }
            });

            // Replace the original text node with the new contents
            const parent = node.parentNode;
            parent.replaceChild(frag, node);
            parent.normalize(); // Merge adjacent text nodes
        }
    }
};

export const removeHighlights = () => {
    console.log("highlight.js: remove highlight");
    // Select all highlighted spans by class name
    const highlightedSpans = document.querySelectorAll('.highlight');

    // Iterate through the collected spans
    highlightedSpans.forEach(span => {
        const parent = span.parentNode;

        // Create a new text node with the same content as the span
        const textNode = document.createTextNode(span.textContent);

        // Replace the span with the new text node
        parent.replaceChild(textNode, span);

        // Normalize the parent to merge adjacent text nodes
        parent.normalize();
    });
};
