import React from "react";
import Chatbot from "./components/Chatbot";
import "./App.css";
import Lottie from "react-lottie";
import * as robot from "./assets/back.json";

function App() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: robot,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div className="app-container">
      <Lottie
        options={defaultOptions}
        height={400}
        width={400}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1, // Make sure it stays behind other content
        }}
      />

      <div className="header">
        <img src={`/ieee-logo.png`} alt="IEEE Logo" className="logo" />
        <h1 className="app-title">IEEE FAQ Chatbot</h1>
      </div>
      <div className="chatbot-container">
        <Chatbot />
      </div>
    </div>
  );
}

export default App;
