'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AES } from 'crypto-js'
import { Inter } from 'next/font/google'
import { Protest_Strike } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
})

const heroFont = Protest_Strike({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
})

const MainPage = () => {
  const [models, setModels] = useState([])

  useEffect(() => {
    const fetchModels = async () => {
      const modelData = [
        {
          id: 1,
          name: 'Perfume Bottle',
          imgsrc: '/img/perfume.png',
          previewUrl: 'https://ik.imagekit.io/d6qn2w0aj/eazweb%20models/sauvage_perfume.glb?updatedAt=1732625954590',
          width: 100, // mm
        },
        {
          id: 2,
          name: 'Hoody',
          imgsrc: '/img/hoody.png',
          previewUrl: 'https://ik.imagekit.io/d6qn2w0aj/eazweb%20models/oversized_sweater.glb?updatedAt=1732625985227',
          width: 150, // mm
        },
        {
          id: 3,
          name: 'Statue',
          imgsrc: '/img/statue.png',
          previewUrl:
            'https://res.cloudinary.com/dzrsboari/image/upload/v1732206757/Addune_Hindu_God_Lord_Ganesha_Idol_Indian_Statue_djrbgv.glb',
          width: 200, // mm
        },
        {
          id: 4,
          name: 'Comfy Chair',
          imgsrc: '/img/chair.png',
          previewUrl: 'https://res.cloudinary.com/dzrsboari/image/upload/v1732354734/arm_chair__furniture_xtxndx.glb',
          width: 800, // mm
        },
        {
          id: 5,
          name: 'Wooden Clock',
          imgsrc: '/img/clock.png',
          previewUrl: 'https://res.cloudinary.com/dzrsboari/image/upload/v1732354804/victorian_clock_clj5r3.glb',
          width: 300, // mm
        },
        {
          id: 6,
          name: 'God Statue',
          imgsrc: '/img/statue.png',
          width: 100, // mm
          previewUrl: 'https://res.cloudinary.com/dzrsboari/image/upload/v1732354734/arm_chair__furniture_xtxndx.glb',
        },
        {
          id: 7,
          name: 'Cheese Pizza',
          imgsrc: '/img/pizza.png',
          previewUrl: 'https://res.cloudinary.com/dzrsboari/image/upload/v1732355573/pizza_xgkgo4.glb',
          width: 250, // mm
        },

        {
          id: 10,
          name: 'Chicken burger',
          imgsrc: '/img/burger.png',
          previewUrl:
            'https://ik.imagekit.io/d6qn2w0aj/eazweb%20models/KFC,%20zinger%20burger%20photogrammetry.glb?updatedAt=1732624718119',
          width: 120, // mm
        },
        {
          id: 11,
          name: 'Classy Pizza',
          imgsrc: '/img/pizza2.png',
          previewUrl:
            'https://ik.imagekit.io/d6qn2w0aj/eazweb%20models/Small%20pizza%20photogrammetry.glb?updatedAt=1732624905419',
          width: 350, // mm
        },
      ]
      setModels(modelData)
    }

    fetchModels()
  }, [])

  return (
    <div className={`${inter.className} min-h-screen w-[90%] mx-auto max-w-[1500px]`}>
      <div className='container mx-auto'>
        <h1 className='text-4xl font-bold text-gray-800 mb-8 text-center'>3D Model Gallery</h1>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center gap-12'>
          {models.map((model) => {
            const encryptedUrl = encodeURIComponent(
              AES.encrypt(model.previewUrl, 'secret-key').toString() + `+${model.width}`,
            )
            return (
              <Link key={model.id} href={`/model/${encryptedUrl}`} className='group'>
                <div className=' rounded-lg aspect-[5/4] shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl relative'>
                  <div className='flex items-center justify-center p-4 h-full'>
                    <img
                      src={model.imgsrc}
                      alt={model.name}
                      className='max-w-full max-h-full object-contain transition-all duration-700 group-hover:scale-110 group-hover:opacity-30'
                    />
                  </div>
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <h3
                      className={`text-4xl font-bold text-white opacity-0 transform translate-y-[50px] transition-all duration-300 ease-in-out
                                   group-hover:opacity-100 group-hover:translate-y-0
                                   group-hover:text-zinc-700 group-hover:font-black ${heroFont.className}`}
                    >
                      {model.name}
                    </h3>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default MainPage
