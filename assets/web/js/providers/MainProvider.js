import React, { useEffect, useState } from "react";
import MainContext from "../contexts/MainContext";


const MainProvider = ({ children }) => {
  const value = {};

  useEffect(()=>{
    
    return () => {};
  }, [])

  return <MainContext.Provider value={value}>{children}</MainContext.Provider>;
};

export default MainProvider;
