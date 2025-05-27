import React, { useEffect, useState } from "react";
import MenuContext from "../contexts/MenuContext";
import { Api } from "../api";
import { handleDateData } from "../utils/dateHelper";

const MenuProvider = ({ children }) => {
  const [menus, setMenus] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState();

  const refetchMenus = async (newMenu) => {
    const response = await Api.getMenus();
    if (!response.data || response.data.success !== true) {
      console.log("Error when get menus");
      return;
    } 
    setMenus(response.data.results);
  };


  const value = {
    selectedMenu,
    setSelectedMenu,
    menus,
    setMenus,
    refetchMenus,
  };

  useEffect(()=>{
    refetchMenus();
    
    return () => {}
  }, [])


  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};

export default MenuProvider;
