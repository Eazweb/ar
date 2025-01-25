'use client'
import { useEffect, useRef } from 'react'

export const useMousePositionRef = (containerRef) => {
  const mousePositionRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (!containerRef?.current) return // Prevent errors if containerRef is undefined

    const updateMousePosition = (event) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        mousePositionRef.current = {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        }
      }
    }

    const container = containerRef.current
    container.addEventListener('mousemove', updateMousePosition)

    return () => {
      if (container) {
        container.removeEventListener('mousemove', updateMousePosition)
      }
    }
  }, [containerRef])

  return mousePositionRef
}
