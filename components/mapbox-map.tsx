"use client"

import { useEffect, useRef, useState } from "react"

declare global {
  interface Window {
    mapboxgl?: any
  }
}

export type MapboxMapProps = {
  latitude?: number
  longitude?: number
  onChange?: (coords: { latitude: number; longitude: number }) => void
  height?: number | string
  zoom?: number
}

export default function MapboxMap({ latitude, longitude, onChange, height = 320, zoom = 12 }: MapboxMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [ready, setReady] = useState(false)
  const [marker, setMarker] = useState<any>(null)

  useEffect(() => {
    // Load CSS once
    const cssHref = "https://api.mapbox.com/mapbox-gl-js/v3.6.0/mapbox-gl.css"
    if (!document.querySelector(`link[href='${cssHref}']`)) {
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = cssHref
      document.head.appendChild(link)
    }

    // Load JS once
    const scriptSrc = "https://api.mapbox.com/mapbox-gl-js/v3.6.0/mapbox-gl.js"
    const ensureScript = () =>
      new Promise<void>((resolve) => {
        if (window.mapboxgl) {
          resolve()
          return
        }
        const script = document.createElement("script")
        script.src = scriptSrc
        script.async = true
        script.onload = () => resolve()
        document.body.appendChild(script)
      })

    ensureScript().then(() => setReady(true))
  }, [])

  useEffect(() => {
    if (!ready || !containerRef.current || !window.mapboxgl) return

    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    if (!accessToken) {
      // Render a message if token is missing
      containerRef.current.innerHTML = '<div style="padding:12px;color:#991B1B;background:#FEE2E2;border:1px solid #FECACA;border-radius:8px;font-size:14px;">Missing NEXT_PUBLIC_MAPBOX_TOKEN</div>'
      return
    }

    const mapboxgl = window.mapboxgl
    mapboxgl.accessToken = accessToken

    const initLng = typeof longitude === 'number' ? longitude : 90.399452
    const initLat = typeof latitude === 'number' ? latitude : 23.777176

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [initLng, initLat],
      zoom,
      attributionControl: true,
    })

    // Add controls
    map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }))
    map.addControl(new mapboxgl.ScaleControl())

    // Marker setup
    const m = new mapboxgl.Marker({ draggable: false })
    if (typeof longitude === 'number' && typeof latitude === 'number') {
      m.setLngLat([longitude, latitude]).addTo(map)
    }
    setMarker(m)

    // Click to place marker
    const onClick = (e: any) => {
      const { lng, lat } = e.lngLat
      if (m) {
        m.setLngLat([lng, lat]).addTo(map)
      }
      onChange?.({ latitude: lat, longitude: lng })
    }
    map.on('click', onClick)

    return () => {
      map.off('click', onClick)
      map.remove()
    }
  }, [ready])

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: typeof height === 'number' ? `${height}px` : height, borderRadius: 8, overflow: 'hidden' }}
    />
  )
}
