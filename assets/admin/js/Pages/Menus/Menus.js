import { Box } from '@mui/material'
import React from 'react'
import MenuList from '../../Components/menus/MenuList'
import Header from '../../Components/Layouts/Header'
import { ToastContainer } from 'react-toastify'
import AddNewMenu from '../../Components/menus/AddNewMenu'

const Menus = () => {
  return (
    <Box className="menus-wrapped">
        <Header title="Menus" />
        <AddNewMenu />
        <MenuList />
        <ToastContainer />
    </Box>
  )
}

export default Menus