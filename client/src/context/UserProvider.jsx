import { createContext, useState } from "react";

export const UserContext = createContext(
  JSON.parse(localStorage.getItem("user")) || null
);

export function UserProvider({ children }) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
