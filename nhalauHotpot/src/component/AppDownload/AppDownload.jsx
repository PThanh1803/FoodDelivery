import React from 'react'
import './AppDownload.css'
import { assets } from '../../assets/assets'
const AppDownload = () => {
  return (
    <div className='app-download ' id='app-download'>
        <p>For better experience download our app <br/>HotPot </p>
        <div className="app-download-platforms">
            <img src={assets.play_store} alt="googleplay"/>
            <img src={assets.app_store} alt="appstore"/>
        </div>
    </div>
  )
}

export default AppDownload

