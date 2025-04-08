import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const Contact = () => {
  return (
    <div>
      
      <div className='text-center text-2xl pt-10 border-t border-[#283593]'>
          <Title text1={'CONTACT'} text2={'US'} color={'#D50000'} />
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        <img className='w-full md:max-w-[480px] border-2 border-[#283593]' src={assets.contact_img} alt="" />
        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-semibold text-xl text-[#283593]'>Our Store</p>
          <p className='text-gray-700'>
            Shop No.4, Sharada Complex <br />
            Near J.J. Hospital, Kalyan Nagar X Road, <br />
            S.R. Nagar, Hyderabad - 500038
          </p>
          <p className='text-gray-700'>
            Tel: +91-XXXXXXXXXX <br />
            Email: <span className='text-[#D50000]'>contact@vtfashions.com</span>
          </p>
        </div>
      </div>

      {/* <NewsletterBox/> */}
    </div>
  )
}

export default Contact
