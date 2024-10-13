import React from 'react'
import './Sidebar.css'
import {assets} from "../../assets/assets"
import { NavLink } from 'react-router-dom'
export const Sidebar = () => {
  return (
    <div className="sidebar">
        <div className="sidebar-options">
          <NavLink to='/add' className="sidebar-option">
            <img src={assets.add_icon} alt="" />
            <p>Add Item</p>
          </NavLink>

          <NavLink to='/list' className="sidebar-option">
            <img src={assets.order_icon} alt="" />
            <p>List Items</p>
          </NavLink>

          <NavLink to='/orders' className="sidebar-option">
            <img src={assets.order_icon} alt="" />
            <p>Place Orders</p>
          </NavLink>

          <NavLink to='/voucher' className="sidebar-option">
            <img src={assets.order_icon} alt="" />
            <p>Voucher</p>
          </NavLink>
        </div>
    </div>
  )
}
