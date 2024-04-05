import React from 'react';
import ReactDOM from 'react-dom';
import ConversationUI from './ConversationUI';
import './Popup.css'; // Make sure to style your popup

const Popup = () => {
    return (
        <div className="popup-container">
            <ConversationUI />
        </div>
    );
};

export default Popup;
