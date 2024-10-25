import React from 'react'
import logo from '../../assests/shop_logo.png'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import './header.css'

const Header = () => {
  return (
    <div className='Header'>
        <div className='navbar'>
            <div className='logo_name'>
                <img src={logo} alt='logo' />
                <h2>Happy Shop</h2>
            </div>
            <div className='search_bar'>
                <input type='text' placeholder='Search for products'/>
                <button><SearchRoundedIcon/></button>
            </div>
            <div className='navbar_links'>
                <a href='https://web.whatsapp.com/'><button>Login</button></a>
                <a href='https://web.whatsapp.com/'>Cart</a>
            </div>
        </div>
    </div>
  )
}

export default Header
