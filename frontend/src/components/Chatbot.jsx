import React, { useState, useEffect, useRef } from 'react';
import { FiMessageCircle, FiX, FiSend } from 'react-icons/fi';
import axios from 'axios';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Hi! I'm your NoteLink assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessageToDialogflow = async (message) => {
    try {
      const response = await axios.post('/api/chatbot/query', {
        message: message,
        sessionId: `notelink-${Date.now()}` // You can store this in localStorage for persistent sessions
      });

      return response.data.reply;
    } catch (error) {
      console.error('Error communicating with chatbot:', error);
      return "Sorry, I'm having trouble connecting right now. Please try again later.";
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;

    const userMessage = {
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Get bot response
    const botReply = await sendMessageToDialogflow(inputMessage);

    const botMessage = {
      text: botReply,
      sender: 'bot',
      timestamp: new Date().toISOString()
    };

    setIsTyping(false);
    setMessages(prev => [...prev, botMessage]);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 h-14 w-14 sm:h-16 sm:w-16 flex items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
          isOpen ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gradient-to-br from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600'
        } text-black`}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? <FiX size={24} /> : <FiMessageCircle size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 h-[60vh] sm:h-[500px] max-w-sm bg-black rounded-lg shadow-2xl flex flex-col overflow-hidden border border-yellow-400">
          {/* Header */}
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black p-3 sm:p-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="h-8 w-8 sm:h-10 sm:w-10 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                <FiMessageCircle className="text-yellow-400" size={18} />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-sm sm:text-base truncate">NoteLink Assistant</h3>
                <p className="text-xs text-yellow-600 truncate">Always here to help</p>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 bg-black space-y-3 sm:space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-lg p-2 sm:p-3 text-xs sm:text-sm ${
                    message.sender === 'user'
                      ? 'bg-yellow-400 text-black rounded-br-none'
                      : 'bg-gray-800 text-gray-100 rounded-bl-none shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.text}</p>
                  <span
                    className={`text-xs mt-1 block ${
                      message.sender === 'user' ? 'text-yellow-700' : 'text-gray-400'
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-800 rounded-lg rounded-bl-none p-3 shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-3 sm:p-4 bg-black border-t border-gray-800 flex-shrink-0">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type message..."
                className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-xs sm:text-sm min-h-[44px] bg-gray-900 text-white"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isTyping}
                className="h-10 w-10 flex items-center justify-center bg-yellow-400 text-black rounded-full hover:bg-yellow-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                aria-label="Send message"
              >
                <FiSend size={18} />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
