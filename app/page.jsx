'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { AES } from 'crypto-js'
import { Inter, Montserrat, Protest_Strike } from 'next/font/google'
import { modelData } from 'congif'
import VariableFontAndCursor from './_components/HeadingStyles'
import { useMousePositionRef } from 'hooks/HeadingStylesHoook'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
})

const heroFont = Protest_Strike({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
})

const main_font = Montserrat({
  subsets: ['latin'],
  weight: ['400', '600', '800'],
})

const MainPage = () => {
  const [models, setModels] = useState([])
  const containerRef = useRef(null)

  const { x, y } = useMousePositionRef(containerRef)

  const fetchModels = async () => {
    setModels(modelData)
  }
  useEffect(() => {
    fetchModels()
  }, [])

  return (
    <div className={`${main_font.className} min-h-screen w-[90%] mx-auto max-w-[1500px]`} ref={containerRef}>
      <div className='container mx-auto'>
        <VariableFontAndCursor
          label='Eazweb 3D Models'
          className='text-5xl sm:text-7xl md:text-7xl text-zinc-900 flex justify-center items-center py-8'
          fontVariationMapping={{
            y: { name: 'wght', min: 100, max: 900 },
            x: { name: 'slnt', min: 0, max: -10 },
          }}
          containerRef={containerRef}
        />
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center gap-12'>
          {models.map((model) => {
            const encryptedUrl = encodeURIComponent(
              AES.encrypt(model.previewUrl, 'secret-key').toString() + `@` + `${model.width}`,
            )
            return (
              <Link key={model.id} href={`/model/${encryptedUrl}`} className='group'>
                <div className=' rounded-lg aspect-[5/4] shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl relative'>
                  <div className='flex items-center justify-center p-4 h-full'>
                    <img
                      src={model.imgsrc}
                      alt={model.name}
                      className='max-w-full max-h-full object-contain transition-all duration-700 group-hover:scale-110 rounded-xl  group-hover:opacity-30'
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
