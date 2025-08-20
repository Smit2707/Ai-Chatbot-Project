import React, { useEffect, useRef, useState } from 'react'
import { io } from "socket.io-client";

const SendIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"
    viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M22 2L11 13"></path>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M22 2L15 22L11 13L2 9l20-7z"></path>
  </svg>
);
const App = () => {
  const [socket, setSocket] = useState(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "👋 Hi! How can I help you today?"
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((msgs) => [...msgs, { role: "user", text: input.trim() }]);
    socket.emit("ai-message", { prompt: input.trim() });
    setInput("");
    setIsTyping(true);


    // Simulate bot reply delay
    // setTimeout(() => {
    //   setMessages((msgs) => [
    //     ...msgs,
    //     { role: "bot", text: "🤖 This is a sample bot reply." },
    //   ]);
    //   setIsTyping(false);
    // }, 850);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  useEffect(() => {
    let socketInstance = io("http://localhost:3000");
    setSocket(socketInstance);
    socketInstance.on("ai-message-response", (response) => {
      setMessages((msgs) => [
        ...msgs,
        { role: "bot", text: response },
      ]);
      setIsTyping(false);
    });
  }, []);
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 via-blue-500 to-sky-400">
      <div className="w-full max-w-md mx-auto flex flex-col h-[90vh] bg-white/60 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/40 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-white/40 border-b border-white/50 backdrop-blur-md">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
            <h2 className="text-base md:text-lg font-semibold text-gray-800">AI Chatbot</h2>
          </div>
          <span className="text-xs text-gray-400 font-medium">Online</span>
        </div>

        {/* Messages */}
        <div className="flex-1 px-3 py-4 md:px-5 overflow-y-auto custom-scrollbar">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex mb-2 ${msg.role === "user" ? "justify-end" : "justify-start"
                }`}
            >
              <div
                className={`relative px-4 py-2.5 rounded-2xl max-w-[80%] text-sm shadow-md
                  ${msg.role === "user"
                    ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-tr-md"
                    : "bg-white/80 text-gray-800 border border-blue-100 rounded-tl-md"
                  }
                  transition-all duration-300 ease-in-out`}
                style={{ animation: "fade-in 0.36s" }}
              >
                {msg.text}
                {/* Message Tail */}
                <span
                  className={`absolute w-3 h-3 bottom-0 ${msg.role === "user"
                    ? "right-[-10px] bg-gradient-to-br from-blue-500 to-indigo-600 rounded-br-lg"
                    : "left-[-10px] bg-white/80 border-b border-l border-blue-100 rounded-bl-lg"
                    }`}
                  style={{
                    clipPath: msg.role === "user"
                      ? "polygon(0 0,100% 0,100% 100%)"
                      : "polygon(0 0,100% 100%,0 100%)",
                  }}
                />
              </div>
            </div>
          ))}
          {/* Typing bubble */}
          {isTyping && (
            <div className="flex justify-start mb-2">
              <div className="px-4 py-2.5 rounded-2xl max-w-[60%] bg-white/80 border border-blue-100 text-gray-600 text-sm flex gap-2 items-center">
                <div className="typing-dot bg-blue-400 animate-typing-dot"></div>
                <div className="typing-dot bg-blue-400 animate-typing-dot [animation-delay:150ms]"></div>
                <div className="typing-dot bg-blue-400 animate-typing-dot [animation-delay:300ms]"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-white/60 backdrop-blur-md border-t border-white/40">
          <input
            className="flex-1 rounded-full px-4 py-2.5 text-gray-800 bg-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400/50 placeholder:text-gray-400 font-medium text-sm transition"
            type="text"
            value={input}
            placeholder="Type your message…"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleInputKeyDown}
            autoFocus
          />
          <button
            className="grid place-items-center ml-1 text-white bg-gradient-to-br from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 p-3 rounded-full shadow-lg transition active:scale-95 disabled:opacity-60"
            onClick={handleSend}
            disabled={!input.trim()}
            aria-label="Send"
          >
            <SendIcon />
          </button>
        </div>
        {/* Custom Scrollbar + Animations */}
        <style>{`
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: #a0aec0 #f7fafc;
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #a0aec0;
            border-radius: 4px;
          }
          .typing-dot {
            width: 7px;
            height: 7px;
            border-radius: 9999px;
            display: inline-block;
          }
          @keyframes typing-dot {
            0%, 80%, 100% {
              opacity: 0.25;
              transform: scale(0.8);
            }
            40% {
              opacity: 1;
              transform: scale(1.2);
            }
          }
          .animate-typing-dot {
            animation: typing-dot 1s infinite;
          }
          @keyframes fade-in {
            0% { opacity: 0; transform: scale(0.97) translateY(16px);}
            100% { opacity: 1; transform: scale(1) translateY(0);}
          }
        `}</style>
      </div>
    </div>
  );
}

export default App;