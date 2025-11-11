
import React, { createContext, useContext, useRef, useState, useCallback } from 'react';

const MessageContext = createContext();

let idCounter = 0;

export function MessageProvider({ children }) {
  const [messages, setMessages] = useState([]); // {id, message, type, duration, createdAt}
  const timers = useRef({});

  const removeMessage = useCallback((id) => {
    setMessages(msgs => msgs.filter(m => m.id !== id));
    if (timers.current[id]) {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  }, []);

  const showMessage = useCallback((msg, msgType = 'info', duration = 3000) => {
    setMessages(msgs => {
      const newMsg = {
        id: ++idCounter,
        message: msg,
        type: msgType,
        duration,
        createdAt: Date.now(),
      };
      // Only keep up to 4 messages
      const nextMsgs = [...msgs, newMsg].slice(-4);
      return nextMsgs;
    });
  }, []);

  // Set up timers for auto-dismiss
  React.useEffect(() => {
    messages.forEach(m => {
      if (!timers.current[m.id]) {
        timers.current[m.id] = setTimeout(() => removeMessage(m.id), m.duration);
      }
    });
    // Clean up timers for removed messages
    Object.keys(timers.current).forEach(id => {
      if (!messages.find(m => m.id === Number(id))) {
        clearTimeout(timers.current[id]);
        delete timers.current[id];
      }
    });
  }, [messages, removeMessage]);

  return (
    <MessageContext.Provider value={{ showMessage, messages, removeMessage }}>
      {children}
    </MessageContext.Provider>
  );
}

export function useMessage() {
  return useContext(MessageContext);
}
