import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import ReactMarkdown from "react-markdown";
import axios from "axios";

// Import avatar images
import questionAvatarImage from './assets/question-avatar.png';
import answerAvatarImage from './assets/answer-avatar.png';

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const [history, setHistory] = useState([]);
  const chatbotHistoryRef = useRef(null);

  useEffect(() => {
    // Scroll chat history to the bottom when answer changes
    if (chatbotHistoryRef.current) {
      chatbotHistoryRef.current.scrollTop = chatbotHistoryRef.current.scrollHeight;
    }
  }, [answer]);

  async function generateAnswer() {
    setGeneratingAnswer(true);
    setAnswer("");
    try {
      // Simulate typing animation
      await new Promise(resolve => setTimeout(resolve, 800));

      // Actual API call
      const response = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyD-S6ZrA8UKNXk-Adb6BRfNmP1743-o4m0",
        method: "post",
        data: {
          contents: [{ parts: [{ text: question }] }],
        },
      });
      const answerText = response.data.candidates[0].content.parts[0].text;
      setAnswer(answerText);
      setHistory([...history, { question, answer: answerText }]);
      setQuestion("");
    } catch (error) {
      console.log(error);
      setAnswer("Sorry! Something went wrong. Please try again!");
    }

    setGeneratingAnswer(false);
  }

  return (
      <div className="chatbot-container">
        <div className="chatbot-header">CADBOT</div>
        <div ref={chatbotHistoryRef} className="chatbot-history">
          {history.map((entry, index) => (
              <div key={index} className="chatbot-history-entry">
                <div className="chatbot-question-avatar">
                  <img src={answerAvatarImage} alt="Question Avatar" className="avatar-image" />
                  <div className="chatbot-question">
                    {entry.question}
                  </div>
                </div>
                <div className="chatbot-answer-avatar">
                  <img src={questionAvatarImage} alt="Answer Avatar" className="avatar-image" />
                  <div className="chatbot-answer">
                    <ReactMarkdown>{entry.answer}</ReactMarkdown>
                    {index === history.length - 1 && generatingAnswer && (
                        <div className="typing-indicator">
                          <span className="typing-dot"></span>
                          <span className="typing-dot"></span>
                          <span className="typing-dot"></span>
                        </div>
                    )}
                  </div>
                </div>
              </div>
          ))}
        </div>
        <form
            className="chatbot-input-container"
            onSubmit={(e) => {
              e.preventDefault();
              generateAnswer();
            }}
        >
          <input
              type="text"
              required
              placeholder="Ask anything..."
              className="chatbot-input"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
          />
          <button
              type="submit"
              disabled={generatingAnswer}
              className="chatbot-button"
          >
            Send
          </button>
        </form>
      </div>
  );
}

export default App;
