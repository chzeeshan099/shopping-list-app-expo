import React, { createContext, useState } from "react";

export const HistoryContext = createContext({
  history: [],
  addEntry: () => {},
  clearHistory: () => {},
});

export function HistoryProvider({ children }) {
  const [history, setHistory] = useState([]);

  function addEntry(entry) {
    setHistory((prev) => [{ id: Date.now().toString(), ...entry }, ...prev]);
  }

  function clearHistory() {
    setHistory([]);
  }

  return (
    <HistoryContext.Provider value={{ history, addEntry, clearHistory }}>
      {children}
    </HistoryContext.Provider>
  );
}

export default HistoryProvider;
