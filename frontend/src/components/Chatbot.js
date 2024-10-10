import React, { useState } from "react";
import "./Chatbot.css";
import Lottie from "react-lottie";
import * as robot from "../assets/robot.json";

function Chatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: robot,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const handleSend = async () => {
    if (input.trim() === "") return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input }),
      });

      const data = await response.json();
      const newBotMessages = [
        ...newMessages,
        { sender: "bot", text: data.answer },
      ];
      setMessages(newBotMessages);
    } catch (error) {
      const errorMessage = [
        ...newMessages,
        { sender: "bot", text: "Error: Failed to get response." },
      ];
      setMessages(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        {messages.length === 0 && !loading ? (
          <Lottie options={defaultOptions} height={400} width={400} />
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.sender}`}>
              <p>{msg.text}</p>
            </div>
          ))
        )}

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        )}
      </div>
      <hr />
      <div className="input-box">
        <input
          type="text"
          placeholder="Type your message here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={loading}
        />
        <button onClick={handleSend} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
}

export default Chatbot;
