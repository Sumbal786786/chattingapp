import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

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
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });

    return () => socket.off("receive_message");
  }, [socket]);

  return (
    <div className="bg-slate-900/95 backdrop-blur-md w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl rounded-2xl shadow-2xl flex flex-col h-550px sm:h-620px border border-slate-800 overflow-hidden">
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(90deg, #1e293b 0%, #334155 100%)",
        }}
        className="p-4 border-b border-slate-700/60"
      >
        <p className="text-white font-bold text-sm sm:text-base tracking-wide text-center">
          Live Chat | Room: <span className="text-cyan-400">{room}</span>
        </p>
      </div>

      {/* Messages Body */}
      <div className="flex-1 p-4 overflow-y-auto bg-slate-950/60 flex flex-col">
        <ScrollToBottom className="h-full w-full flex flex-col gap-3">
          {messageList.map((messageContent, idx) => {
            const isSelf = username === messageContent.author;
            return (
              <div
                key={idx}
                className={`flex flex-col mb-3 ${
                  isSelf ? "items-end" : "items-start"
                }`}
              >
                <div
                  style={{
                    background: isSelf
                      ? "linear-gradient(135deg, #06b6d4 0%, #2563eb 100%)"
                      : "linear-gradient(135deg, #334155 0%, #475569 100%)",
                  }}
                  className={`max-w-[85%] sm:max-w-[75%] px-4 py-2.5 rounded-2xl text-white shadow-md ${
                    isSelf ? "rounded-br-none" : "rounded-bl-none"
                  }`}
                >
                  <p className="text-xs sm:text-sm wrap-break-words leading-relaxed">
                    {messageContent.message}
                  </p>
                </div>
                <div className="flex gap-2 text-[10px] text-slate-400 mt-1 px-1">
                  <span>{messageContent.time}</span>
                  <span className="font-bold text-cyan-400">
                    {messageContent.author}
                  </span>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>

      {/* Footer / Input */}
      <div className="p-3.5 bg-slate-800/90 border-t border-slate-700/60 flex gap-2">
        <input
          type="text"
          value={currentMessage}
          placeholder="Hey..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-cyan-500 text-xs sm:text-sm"
        />
        <button
          onClick={sendMessage}
          style={{
            background: "linear-gradient(90deg, #06b6d4 0%, #3b82f6 100%)",
          }}
          className="px-4 sm:px-6 py-2.5 text-white rounded-xl font-medium text-xs sm:text-sm hover:opacity-90 transition active:scale-[0.98] shadow-md"
        >
          &#9658;
        </button>
      </div>
    </div>
  );
}

export default Chat;