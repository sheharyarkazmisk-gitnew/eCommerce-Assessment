import React, { useState } from 'react';
import styles from './Chat.css';

const Chat = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = { text: input, sender: 'user' };
      setMessages(prevMessages => [...prevMessages, userMessage]);
      const currentInput = input;
      setInput('');
      setLoading(true);

      try {
        const response = await fetch('http://localhost:4000/api/v1/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: currentInput }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }
        
        const botMessage = { text: data.reply, sender: 'bot' };
        setMessages(prevMessages => [...prevMessages, botMessage]);

      } catch (error) {
        console.error('Error fetching chat response:', error);
        const errorMessage = { text: error.message, sender: 'bot' };
        setMessages(prevMessages => [...prevMessages, errorMessage]);
      } finally {
        setLoading(false);
      }
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h2>Chat</h2>
        <button onClick={onClose}>X</button>
      </div>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {loading && <div className="message bot loading">Loading...</div>}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          disabled={loading}
        />
        <button onClick={handleSend} disabled={loading}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
