import React from 'react'
import './home.css'
import p_image from '../../assests/product.jpeg'
import StarBorderIcon from '@mui/icons-material/StarBorder';


const Home = () => {
  return (
    <div className='home'>
        <h1>Latest Products</h1>
        <section className='products'>
          <div className='card'>
            <div className='p_image'>
              <img src={p_image} alt='product'/>
            </div>
            <div className='p_info'>
              <h3>Nikon Camera DSLR</h3>
              <p><StarBorderIcon/><StarBorderIcon/><StarBorderIcon/><StarBorderIcon/><StarBorderIcon/> (5 reviews)</p>
              <p>Price: $100</p>
              <button>View Details</button>
            </div>
          </div>
        </section>
    </div>
  )
}

export default Home