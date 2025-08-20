import React, { useEffect, useRef, useState } from "react";
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
    if (socket) {
      socket.emit("ai-message", { prompt: input.trim() });
      setIsTyping(true);
    }
    setInput("");
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  useEffect(() => {
    const socketInstance = io("http://localhost:3000");
    setSocket(socketInstance);
    socketInstance.on("ai-message-response", (response) => {
      setMessages((msgs) => [
        ...msgs,
        { role: "bot", text: response },
      ]);
      setIsTyping(false);
    });
    return () => socketInstance.disconnect();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="w-full max-w-md mx-auto flex flex-col h-[90vh] shadow-2xl border border-[#24293d] rounded-2xl backdrop-blur-lg relative overflow-hidden bg-[#181a20]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#232332] bg-black/60 backdrop-blur-md">
          <div className="flex items-center space-x-2">
            {/* <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow" /> */}
            <h2 className="font-semibold text-lg md:text-xl text-white tracking-tight">🤖 Chat-AI</h2>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow" />
            <span className="text-xs text-gray-400 font-medium">Online</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 px-3 py-4 md:px-5 overflow-y-auto custom-scrollbar">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex mb-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`relative px-4 py-3 text-base max-w-[78%] md:max-w-[70%] border
                  transition-all duration-300 ease-in-out
                  ${msg.role === "user"
                    ? "bg-gradient-to-br from-[#323548cc] to-[#23263acc] border-transparent text-white rounded-2xl rounded-tr-md shadow-lg font-normal"
                    : "bg-gradient-to-bl from-[#fffdfc24] to-[#bbb8e026] border-[#26293b] text-white/90 rounded-2xl rounded-tl-md font-normal"
                  }`}
                style={{ animation: "fade-in 0.36s" }}
              >
                {msg.text}
                {/* Message tail (pure visual) */}
                <span
                  className={`absolute w-3 h-3 bottom-1.5 ${msg.role === "user"
                    ? "right-[-10px] bg-gradient-to-br from-[#323548cc] to-[#23263acc] rounded-br-lg"
                    : "left-[-10px] bg-gradient-to-bl from-[#fffdfc24] to-[#bbb8e026] border-b border-l border-[#26293b] rounded-bl-lg"
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
            <div className="flex justify-start mb-3">
              <div className="px-4 py-3 rounded-2xl max-w-[60%] bg-[#292c38cc] border border-[#25283e] text-gray-100 text-base flex gap-2 items-center shadow">
                <div className="typing-dot bg-blue-400 animate-typing-dot"></div>
                <div className="typing-dot bg-blue-400 animate-typing-dot [animation-delay:150ms]"></div>
                <div className="typing-dot bg-blue-400 animate-typing-dot [animation-delay:300ms]"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-[#101116d9] backdrop-blur border-t border-[#232332]">
          <input
            className="flex-1 rounded-2xl px-4 py-2.5 bg-transparent text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-medium text-base transition"
            type="text"
            value={input}
            placeholder="Type your message…"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleInputKeyDown}
            autoFocus
          />
          <button
            className="grid place-items-center ml-1 text-white bg-gradient-to-br from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 p-3 rounded-full shadow-lg transition active:scale-95 disabled:opacity-60"
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
            scrollbar-color: #23293e #181a20;
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 7px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #23293e;
            border-radius: 6px;
          }
          .typing-dot {
            width: 8px;
            height: 8px;
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
            0% { opacity: 0; transform: scale(0.97) translateY(14px);}
            100% { opacity: 1; transform: scale(1) translateY(0);}
          }
        `}</style>
      </div>
    </div>
  );
};

export default App;
