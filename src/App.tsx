import { useState, useEffect } from "react";
import { Store } from "@tauri-apps/plugin-store";

const store = new Store(".messages.dat");

function App() {
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    const loadMessages = async () => {
      const storedMessages = await store.get("messages");
      if (storedMessages) {
        setMessages(storedMessages as any[]);
      }
    };
    loadMessages();
  }, []);

  useEffect(() => {
    store.set("messages", messages);
    store.save(); // Ensure data is saved to disk
  }, [messages]);

  const handleSendMessage = () => {
    if (inputText.trim() === "") return;

    const newMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: "user",
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setInputText("");

    // Simulate a bot response
    setTimeout(() => {
      const botResponse = {
        id: newMessages.length + 1,
        text: `You said: "${inputText}"`, // Simple echo response
        sender: "bot",
      };
      setMessages((prevMessages) => [...prevMessages, botResponse]);
    }, 1000);
  };

  return (
    <div className="container">
      <div className="chat-window">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
      </div>
      <form
        className="input-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App;
