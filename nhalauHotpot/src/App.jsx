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
import SpecialOffers from './component/SpecialOffers/SpecialOffers'
import Rate from './component/Rate/Rate'
import SpecialOffersDetails from './component/SpecialOffersDetails/SpecialOffersDetails'
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
          <Route path='/menu' element={<Menu />} />
          <Route path='/menu/:id' element={<FoodDetails />} />
          <Route path='/specialoffers' element={<SpecialOffers />} />
          <Route path='/specialoffers/:id' element={<SpecialOffersDetails />} />
          <Route path='/rate' element={<Rate />} />
        </Routes>
      </div>
      <Footer />
    </>

  )
}

export default App