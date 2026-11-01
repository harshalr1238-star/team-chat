import { useEffect, useRef, useState } from "react";
import "./App.css";

const members = [
  { name: "Alan", color: "#dce9ff" },
  { name: "Bob", color: "#ffe6d5" },
  { name: "Carol", color: "#d9f5e4" },
  { name: "Dean", color: "#f1ddff" },
  { name: "Elin", color: "#fff0c9" },
];

const initialMessages = [
  {
    id: 1,
    user: "Alan",
    time: "10:30 AM",
    text: "Hey everyone! Welcome to our team chat 👋",
    likes: 2,
  },
  {
    id: 2,
    user: "Carol",
    time: "10:32 AM",
    text: "Thanks! Excited to work with everyone.",
    likes: 1,
  },
  {
    id: 3,
    user: "Bob",
    time: "10:34 AM",
    text: "Let's make something amazing together! 🚀",
    likes: 0,
  },
];

function App() {
  const [messages, setMessages] = useState(initialMessages);
  const [messageText, setMessageText] = useState("");
  const [likedMessages, setLikedMessages] = useState([]);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showMentions, setShowMentions] = useState(false);

  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function sendMessage(event) {
    event?.preventDefault();

    const text = messageText.trim();

    if (!text) {
      inputRef.current?.focus();
      return;
    }

    const newMessage = {
      id: Date.now(),
      user: "You",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      text,
      likes: 0,
    };

    setMessages((previous) => [...previous, newMessage]);
    setMessageText("");
    setShowEmoji(false);
    setShowMentions(false);
    inputRef.current?.focus();
  }

  function toggleLike(messageId) {
    const alreadyLiked = likedMessages.includes(messageId);

    setLikedMessages((previous) =>
      alreadyLiked
        ? previous.filter((id) => id !== messageId)
        : [...previous, messageId]
    );

    setMessages((previous) =>
      previous.map((message) =>
        message.id === messageId
          ? {
            ...message,
            likes: Math.max(
              0,
              message.likes + (alreadyLiked ? -1 : 1)
            ),
          }
          : message
      )
    );
  }

  function addEmoji(emoji) {
    setMessageText((previous) => previous + emoji);
    setShowEmoji(false);
    inputRef.current?.focus();
  }

  function addMention(name) {
    setMessageText((previous) => {
      const prefix = previous && !previous.endsWith(" ") ? " " : "";
      return `${previous}${prefix}@${name} `;
    });

    setShowMentions(false);
    inputRef.current?.focus();
  }

  function handleInputChange(event) {
    const value = event.target.value;

    setMessageText(value);

    const lastWord = value.split(/\s/).pop();
    setShowMentions(lastWord.startsWith("@"));
    setShowEmoji(false);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }

    if (event.key === "Escape") {
      setShowEmoji(false);
      setShowMentions(false);
    }
  }

  function getMember(name) {
    return (
      members.find((member) => member.name === name) || {
        name,
        color: "#635bff",
      }
    );
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">✦</div>

          <div>
            <h1>TeamSpace</h1>
            <p>Team Chat</p>
          </div>
        </div>

        <div className="online-status">
          <span className="status-dot"></span>
          <span>Team is active</span>
        </div>
      </header>

      <main className="chat-container">
        <section className="chat-header">
          <div className="channel-info">
            <div className="chat-title-icon">#</div>

            <div>
              <h2>general</h2>
              <p>Chat with your team and share ideas</p>
            </div>
          </div>

          <div className="member-count">
            <span className="member-dot">●</span>
            {members.length} members
          </div>
        </section>

        <section className="messages-area" aria-label="Chat messages">
          <div className="date-divider">
            <span>Today</span>
          </div>

          {messages.map((message) => {
            const member = getMember(message.user);
            const isLiked = likedMessages.includes(message.id);

            return (
              <article className="message" key={message.id}>
                <div
                  className="avatar"
                  style={{ backgroundColor: member.color }}
                >
                  {message.user.charAt(0).toUpperCase()}
                </div>

                <div className="message-content">
                  <div className="message-meta">
                    <strong>{message.user}</strong>
                    <span>{message.time}</span>
                  </div>

                  <div className="message-text">{message.text}</div>

                  <div className="message-actions">
                    <button
                      type="button"
                      className={`like-button ${isLiked ? "liked" : ""}`}
                      onClick={() => toggleLike(message.id)}
                      aria-label={`Like message from ${message.user}`}
                      aria-pressed={isLiked}
                    >
                      <span>{isLiked ? "♥" : "♡"}</span>
                      <span>{message.likes}</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}

          <div ref={bottomRef}></div>
        </section>

        <form className="composer" onSubmit={sendMessage}>
          <div className="composer-box">
            <input
              ref={inputRef}
              type="text"
              value={messageText}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Message the team..."
              aria-label="Write a message"
            />

            <div className="composer-tools">
              <div className="tool-wrapper">
                <button
                  type="button"
                  className="tool-button"
                  aria-label="Add emoji"
                  title="Add emoji"
                  onClick={() => {
                    setShowEmoji((previous) => !previous);
                    setShowMentions(false);
                  }}
                >
                  ☺
                </button>

                {showEmoji && (
                  <div className="popup emoji-popup">
                    {["😀", "😂", "😍", "👍", "❤️", "🎉", "👋", "🚀"].map(
                      (emoji) => (
                        <button
                          type="button"
                          key={emoji}
                          onClick={() => addEmoji(emoji)}
                          aria-label={`Add ${emoji}`}
                        >
                          {emoji}
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>

              <div className="tool-wrapper">
                <button
                  type="button"
                  className="mention-button"
                  aria-label="Mention a team member"
                  title="Mention a team member"
                  onClick={() => {
                    setShowMentions((previous) => !previous);
                    setShowEmoji(false);
                  }}
                >
                  @
                </button>

                {showMentions && (
                  <div className="popup mentions-popup">
                    <strong>Mention someone</strong>

                    {members.map((member) => (
                      <button
                        type="button"
                        key={member.name}
                        onClick={() => addMention(member.name)}
                      >
                        <span
                          className="small-avatar"
                          style={{ backgroundColor: member.color }}
                        >
                          {member.name.charAt(0)}
                        </span>

                        {member.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="send-button"
                aria-label="Send message"
                title="Send message"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m22 2-7 20-4-9-9-4 20-7Z" />
                  <path d="M22 2 11 13" />
                </svg>
              </button>
            </div>
          </div>

          <p className="composer-hint">
            Press <kbd>Enter</kbd> to send your message
          </p>
        </form>
      </main>

      <footer className="footer">Made for better teamwork ✦</footer>
    </div>
  );
}

export default App;