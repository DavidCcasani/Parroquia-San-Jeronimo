import { useEffect } from 'react'
import { getSeoForPath } from '../constants/seoData'

function setMetaTag(selector, attrName, attrValue, content) {
  let element = document.querySelector(selector)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attrName, attrValue)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

function setCanonical(url) {
  let link = document.querySelector('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  link.setAttribute('href', url)
}

/**
 * Hook para sincronizar dinámicamente el título y metadatos SEO en cada cambio de ruta SPA
 */
export function useDynamicSeo(currentPath) {
  useEffect(() => {
    const seo = getSeoForPath(currentPath)

    // 1. Título de la pestaña
    document.title = seo.title

    // 2. Meta descripción estándar
    setMetaTag('meta[name="description"]', 'name', 'description', seo.description)

    // 3. URL canónica
    setCanonical(seo.url)

    // 4. Metadatos Open Graph (Facebook, WhatsApp, LinkedIn)
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', seo.title)
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', seo.description)
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', seo.url)
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', seo.image)
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', seo.type)
    setMetaTag('meta[property="og:locale"]', 'property', 'og:locale', seo.locale)

    // 5. Metadatos Twitter Cards
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', seo.title)
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', seo.description)
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', seo.image)
  }, [currentPath])
}

export default useDynamicSeo
