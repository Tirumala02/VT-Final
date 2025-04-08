import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const About = () => {
  return (
    <div>

      <div className='text-2xl text-center pt-8 border-t border-[#283593]'>
          <Title text1={'ABOUT'} text2={'US'} color={'#D50000'} />
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
          <img className='w-full md:max-w-[450px] border-[#283593] border-2' src={assets.about_img} alt="" />
          <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-700'>
              <p>Welcome to <span className='text-[#D50000] font-semibold'>VT Fashions</span>, where fashion meets individuality. Our journey started with a passion for creating high-quality, trendy, and comfortable clothing that speaks to your personal style.</p>
              <p>We believe that fashion is more than just clothing—it's an expression of confidence and personality. That's why our collections are designed to cater to diverse tastes while maintaining exceptional quality and craftsmanship.</p>
              <b className='text-[#283593]'>Our Mission</b>
              <p>At VT Fashions, our goal is simple: to provide stylish, high-quality fashion that makes you look and feel amazing. Every piece we offer is carefully curated to bring you the best in design and comfort.</p>
          </div>
      </div>

      <div className='text-xl py-4 border-t border-[#283593]'>
          <Title text1={'WHY'} text2={'CHOOSE US'} color={'#D50000'} />
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20'>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 bg-[#E3F2FD]'>
            <b className='text-[#283593]'>Quality Assurance:</b>
            <p className=' text-gray-700'>We meticulously select and vet each product to ensure it meets our stringent quality standards.</p>
          </div>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 bg-[#E3F2FD]'>
            <b className='text-[#283593]'>Convenience:</b>
            <p className=' text-gray-700'>With our user-friendly interface and hassle-free ordering process, shopping has never been easier.</p>
          </div>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 bg-[#E3F2FD]'>
            <b className='text-[#283593]'>Exceptional Customer Service:</b>
            <p className=' text-gray-700'>Our team of dedicated professionals is here to assist you every step of the way, ensuring your satisfaction is our top priority.</p>
          </div>
      </div>

      {/* <NewsletterBox/> */}
      
    </div>
  )
}

export default About
