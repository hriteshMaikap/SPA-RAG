import React from "react";
import Chatbot from "./components/Chatbot";
import "./App.css";
import { TypeAnimation } from "react-type-animation";
import ieeeLogo from "./assets/ieeeLogo.jpg";

function App() {
  return (
    <div className="app-container">
      <div className="header">
        <img src={ieeeLogo} alt="IEEE Logo" className="logo" />
        <TypeAnimation
          className="welcome-text"
          sequence={["IEEE Chatbot", 1000]}
          wrapper="span"
          speed={50}
          style={{
            fontWeight: "bold",
            display: "inline-block",
          }}
          cursor={false}
          repeat={Infinity}
        />
      </div>
      <div className="chatbot-container">
        <Chatbot />
      </div>
    </div>
  );
}

export default App;
