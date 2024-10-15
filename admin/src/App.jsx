import Navbar from './components/Navbar/Navbar'
import { Sidebar } from './components/Sidebar/Sidebar'
import { Route, Routes } from 'react-router-dom'
import Add from './Pages/Add/Add'
import List from './Pages/List/List'
import Orders from './Pages/Orders/Orders'
import Voucher from './Pages/ListVoucher/ListVoucher'
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import VoucherDetail from './Pages/ListVoucher/VoucherDetail/VoucherDetail'
import  AddVoucher from './Pages/ListVoucher/AddVoucher/AddVoucher'

const App = () => {
  const url = "http://localhost:4000"
  return (
    <div>
        <ToastContainer />
        <Navbar/>
        <hr/>
        <div className="app-content">
          <Sidebar/>
          <Routes>
            <Route path='/add' element={<Add url={url}/>}/>
            <Route path='/list' element={<List url={url}/>}/>
            <Route path='/orders' element={<Orders url={url}/>}/>
            <Route path='/voucher' element={<Voucher url={url}/>}>
              <Route path=':id' element={<VoucherDetail url={url}/>}/>
              <Route path='add' element={<AddVoucher url={url}/>}/>
            </Route>
          </Routes>
        </div>
    </div>
  )
}

export default App