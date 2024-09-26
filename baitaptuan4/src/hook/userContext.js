import React, { createContext, useState, useContext } from "react";

// Tạo UserContext
const UserContext = createContext();

// Tạo Provider để quản lý dữ liệu người dùng
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook để sử dụng UserContext
export const useUser = () => useContext(UserContext);
