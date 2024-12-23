'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { AES, enc } from 'crypto-js'
import ModelViewer from '@/_components/ModelViewer'

const ModelPage = () => {
  const { id } = useParams()
  const [modelUrl, setModelUrl] = useState('')
  const [modelWidth, setModelWidth] = useState(0)

  useEffect(() => {
    if (!id) return

    try {
      const decodedUrl = decodeURIComponent(id)
      const [encryptedPart, widthPart] = decodedUrl.split('@')

      const decryptedUrl = AES.decrypt(encryptedPart, 'secret-key').toString(enc.Utf8)
      setModelUrl(decryptedUrl)
      setModelWidth(Number(widthPart) || 0)
    } catch (error) {
      console.error('Error decoding model link:', error)
    }
  }, [id])

  return (
    <div className='h-[100vh] overflow-hidden w-full'>
      {modelUrl && <ModelViewer modelUrl={modelUrl} modelWidth={modelWidth} />}
    </div>
  )
}

export default ModelPage
