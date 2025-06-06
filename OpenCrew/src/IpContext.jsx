import React, { createContext, useState, useEffect } from "react";

export const IpContext = createContext();

export const IpProvider = ({ children }) => {
  const [ip, setIp] = useState("");

  useEffect(() => {
    const fetchIp = async () => {
      try {
        const response = await fetch("https://api64.ipify.org?format=json");
        const data = await response.json();
        setIp(data.ip);
      } catch (error) {
        console.error("IP取得エラー:", error);
      }
    };

    fetchIp();
  }, []);

  return <IpContext.Provider value={ip}>{children}</IpContext.Provider>;
};
