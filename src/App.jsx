import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io.connect("backendchatapp-production-1a3c.up.railway.app");

export default function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      setMessageList((list) => [...list, data]);
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        /* Pinkish-White to Warm Reddish Gradient Background */
        background: "linear-gradient(135deg, #fff0f3 0%, #ffccd5 40%, #ff758f 80%, #c9184a 100%)",
        padding: "20px",
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      }}
    >
      {!showChat ? (
        /* Glassmorphism Join Room Card */
        <div
          style={{
            background: "rgba(255, 255, 255, 0.75)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            padding: "36px 32px",
            borderRadius: "24px",
            boxShadow: "0 20px 50px rgba(164, 19, 60, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
            width: "100%",
            maxWidth: "380px",
            border: "1px solid rgba(255, 255, 255, 0.6)",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <div>
            <h3
              style={{
                color: "#800f2f",
                fontSize: "26px",
                fontWeight: "700",
                textAlign: "center",
                margin: 0,
                letterSpacing: "-0.5px",
              }}
            >
              Join Chat Room
            </h3>
            <p
              style={{
                color: "#a4133c",
                fontSize: "13px",
                textAlign: "center",
                marginTop: "6px",
                marginBottom: 0,
                opacity: 0.85,
              }}
            >
              Connect instantly with your group
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <input
              type="text"
              placeholder="Username..."
              onChange={(event) => setUsername(event.target.value)}
              style={{
                width: "100%",
                padding: "14px 18px",
                borderRadius: "14px",
                backgroundColor: "rgba(255, 255, 255, 0.85)",
                border: "1px solid #ffb3c1",
                color: "#590d22",
                outline: "none",
                fontSize: "14px",
                boxSizing: "border-box",
              }}
            />
            <input
              type="text"
              placeholder="Room ID..."
              onChange={(event) => setRoom(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && joinRoom()}
              style={{
                width: "100%",
                padding: "14px 18px",
                borderRadius: "14px",
                backgroundColor: "rgba(255, 255, 255, 0.85)",
                border: "1px solid #ffb3c1",
                color: "#590d22",
                outline: "none",
                fontSize: "14px",
                boxSizing: "border-box",
              }}
            />
            <button
              onClick={joinRoom}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "14px",
                color: "#ffffff",
                fontWeight: "600",
                fontSize: "15px",
                border: "none",
                cursor: "pointer",
                /* Pink to Red Gradient Button */
                background: "linear-gradient(135deg, #ff4d6d 0%, #c9184a 100%)",
                boxShadow: "0 10px 25px rgba(201, 24, 74, 0.35)",
                marginTop: "6px",
              }}
            >
              Join Room
            </button>
          </div>
        </div>
      ) : (
        /* Aesthetic Pink/Red Chat Window */
        <div
          style={{
            background: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            width: "100%",
            maxWidth: "500px",
            borderRadius: "24px",
            boxShadow: "0 25px 60px rgba(164, 19, 60, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
            display: "flex",
            flexDirection: "column",
            height: "600px",
            border: "1px solid rgba(255, 255, 255, 0.6)",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "linear-gradient(90deg, #fff0f3 0%, #ffccd5 100%)",
              padding: "18px 24px",
              borderBottom: "1px solid #ffb3c1",
              display: "flex",
              justify: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: "#ff4d6d",
                  boxShadow: "0 0 10px #ff4d6d",
                }}
              ></span>
              <p
                style={{
                  color: "#590d22",
                  fontWeight: "600",
                  fontSize: "15px",
                  margin: 0,
                }}
              >
                Room: <span style={{ color: "#c9184a", fontWeight: "700" }}>{room}</span>
              </p>
            </div>
            <button
              onClick={() => setShowChat(false)}
              style={{
                background: "rgba(201, 24, 74, 0.1)",
                color: "#c9184a",
                border: "1px solid rgba(201, 24, 74, 0.3)",
                padding: "6px 14px",
                borderRadius: "10px",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Leave
            </button>
          </div>

          {/* Messages Feed */}
          <div
            style={{
              flex: 1,
              padding: "20px",
              overflowY: "auto",
              backgroundColor: "rgba(255, 240, 243, 0.4)",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            {messageList.map((messageContent, idx) => {
              const isSelf = username === messageContent.author;
              return (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: isSelf ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "78%",
                      padding: "12px 16px",
                      borderRadius: isSelf
                        ? "20px 20px 4px 20px"
                        : "20px 20px 20px 4px",
                      color: isSelf ? "#ffffff" : "#590d22",
                      background: isSelf
                        ? "linear-gradient(135deg, #ff4d6d 0%, #c9184a 100%)"
                        : "rgba(255, 255, 255, 0.95)",
                      border: isSelf
                        ? "none"
                        : "1px solid #ffccd5",
                      boxShadow: isSelf
                        ? "0 8px 20px rgba(201, 24, 74, 0.25)"
                        : "0 4px 12px rgba(164, 19, 60, 0.08)",
                    }}
                  >
                    <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.5", wordBreak: "break-word" }}>
                      {messageContent.message}
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "6px",
                      fontSize: "11px",
                      color: "#a4133c",
                      marginTop: "6px",
                      padding: "0 4px",
                      opacity: 0.8,
                    }}
                  >
                    <span style={{ fontWeight: "600" }}>
                      {messageContent.author}
                    </span>
                    <span>•</span>
                    <span>{messageContent.time}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Input Area */}
          <div
            style={{
              padding: "16px",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              borderTop: "1px solid #ffccd5",
              display: "flex",
              gap: "10px",
            }}
          >
            <input
              type="text"
              value={currentMessage}
              placeholder="Type your message..."
              onChange={(event) => setCurrentMessage(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && sendMessage()}
              style={{
                flex: 1,
                padding: "12px 18px",
                borderRadius: "14px",
                backgroundColor: "#fff0f3",
                border: "1px solid #ffb3c1",
                color: "#590d22",
                outline: "none",
                fontSize: "14px",
              }}
            />
            <button
              onClick={sendMessage}
              style={{
                padding: "12px 22px",
                color: "#ffffff",
                borderRadius: "14px",
                border: "none",
                cursor: "pointer",
                background: "linear-gradient(135deg, #ff4d6d 0%, #c9184a 100%)",
                fontWeight: "600",
                fontSize: "14px",
                boxShadow: "0 6px 18px rgba(201, 24, 74, 0.3)",
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}