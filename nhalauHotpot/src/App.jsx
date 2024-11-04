import React from 'react'
import Navbar from './component/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Card from './pages/Card/Card'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Footer from './component/Footer/Footer'
import LoginPopup from './component/LoginPopup/LoginPopup'
import Verify from './pages/Verify/Verify'
import MyOrders from './pages/MyOrders/MyOrders'
import Menu from './pages/Menu/Menu'
import FoodDetails from './component/FoodDetails/FoodDetails'
import Rate from './component/Rate/Rate'
import UserProfile from './component/UserProfile/UserProfile'
import BookingTable from './pages/BookingTable/BookingTable'
import MyBooking from './pages/MyBooking/MyBooking'
import Promotions from './component/Promotion/Promotion'
import PromotionDetail from './component/PromotionDetail/PromotionDetail'

const App = () => {

  const [showLogin, setShowLogin] = React.useState(false)

  return (
    <>
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      <div className="app">
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/card' element={<Card />} />
          <Route path='/placeorder' element={<PlaceOrder />} />
          <Route path='/verify' element={<Verify />} />
          <Route path='/myorders' element={<MyOrders />} />
          <Route path='/myprofile' element={<UserProfile />} />
          <Route path='/menu' element={<Menu />} />
          <Route path='/menu/:id' element={<FoodDetails />} />
          <Route path='/promotions' element={<Promotions />} />
          <Route path='/promotions/:id' element={<PromotionDetail />} />
          <Route path='/rate' element={<Rate />} />
          <Route path='/bookingtable' element={<BookingTable />} />
          <Route path='/mybookings' element={<MyBooking />} />
        </Routes>
      </div>
      <Footer />
    </>

  )
}

export default App