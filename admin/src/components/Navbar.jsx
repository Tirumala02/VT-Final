import React from 'react'
import {assets} from '../assets/assets'
import { Link, NavLink } from 'react-router-dom';

const Navbar = ({setToken}) => {
  return (
    <div className='flex items-center py-2 px-[4%] justify-between'>
        <Link to='/' className='flex items-center gap-2'>
                <img src={assets.ecomlogo} alt='VT Fashions Logo' className="h-10 sm:h-12 lg:h-14" /> {/* Updated Logo */}
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-wide text-[#283593] font-[Montserrat]">
                    VT <span className="text-[#D50000]">Fashions</span>
                </h1>
            </Link>
        <button onClick={()=>setToken('')} className='bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm'>Logout</button>
    </div>
  )
}

export default Navbar