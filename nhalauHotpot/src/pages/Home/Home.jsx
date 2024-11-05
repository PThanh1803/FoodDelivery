import Header from '../../component/Header/Header'
import ExploreMenu from '../../component/ExploreMenu/ExploreMenu'
import { useState } from 'react'
import FoodDisplay from '../../component/FoodDisplay/FoodDisplay'
import AppDownload from '../../component/AppDownload/AppDownload'
import BookingTable from '../BookingTable/BookingTable'
import Comment from '../../component/Comment/Comment'
import CommentHome from '../../component/CommentHome/CommentHome'

const Home = () => {
  const [category, setCategory] = useState("All")
  return (
    <div >
      <Header />
      <ExploreMenu category={category} setCategory={setCategory} />
      <CommentHome />
      <AppDownload />

    </div>
  )
}

export default Home