import Navbar from './components/Navbar/Navbar'
import { Sidebar } from './components/Sidebar/Sidebar'
import { Route, Routes } from 'react-router-dom'
import Add from './Pages/Add/Add'
import List from './Pages/List/List'
import Orders from './Pages/Orders/Orders'
import Voucher from './Pages/ListVoucher/ListVoucher'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DashBoard from './Pages/DashBoard/DashBoard'
import Promotions from './Pages/Promotion/Promotion'
import Notification from './Pages/Notification/Notification'
import Reservation from './Pages/Reservation/Reservation'
import ReviewDashboard from './Pages/Review/ReviewDashBoard/ReviewDashBoard'
import Login from './components/LoginPopup/LoginPopup'
import React from 'react'
import { StoreContext } from './context/StoreContext'
import { Navigate } from 'react-router-dom'
import UserProfile from './components/UserProfile/UserProfile'
const App = () => {
  const url = "http://localhost:4000"
  const { token } = React.useContext(StoreContext);

  return (
    <div>
      <ToastContainer />
      {token && <Navbar />}
      <hr />
      <div className="app-content">

        <Sidebar />
        <Routes>
          {token ? (
            <>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path='/add' element={<Add url={url} />} />
              <Route path='/list' element={<List url={url} />} />
              <Route path='/orders' element={<Orders url={url} />} />
              <Route path='/voucher' element={<Voucher url={url} />} />
              <Route path='/dashboard' element={<DashBoard url={url} />} />
              <Route path='/promotion' element={<Promotions url={url} />} />
              <Route path='/notification' element={<Notification url={url} />} />
              <Route path='/reservation' element={<Reservation url={url} />} />
              <Route path='/review' element={<ReviewDashboard url={url} />} />
              <Route path='/myprofile' element={<UserProfile />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </>
          ) : (
            <>
              <Route path='/login' element={<Login />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          )}
        </Routes>
      </div>
    </div>
  )
}

export default App