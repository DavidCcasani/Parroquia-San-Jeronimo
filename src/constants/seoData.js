/**
 * Configuración central de SEO para la Parroquia San Jerónimo
 * Dominio base configurable para canonicals, sitemap, robots y Open Graph
 */
export const SITE_URL = 'https://parroquiasanjeronimo.pe'

export const DEFAULT_SEO = {
  title: 'Parroquia San Jerónimo — Templo Matriz de Andahuaylas | Diócesis de Abancay',
  description:
    'Sitio oficial de la Parroquia San Jerónimo en Andahuaylas, Apurímac. Horarios de Misas, sacramentos, trámites pastorales, historia virreinal y comunidad de fe.',
  image: `${SITE_URL}/imagenes/DSC_0640.jpg`,
  type: 'website',
  locale: 'es_PE',
}

export const SEO_ROUTES_DATA = {
  '/': {
    title: 'Parroquia San Jerónimo — Templo Matriz de Andahuaylas | Diócesis de Abancay',
    description:
      'Sitio oficial de la Parroquia San Jerónimo en Andahuaylas, Apurímac. Horarios de Misas, sacramentos, trámites pastorales, historia virreinal y comunidad de fe.',
    image: `${SITE_URL}/imagenes/DSC_0640.jpg`,
  },
  '/historia': {
    title: 'Historia y Creación — Parroquia San Jerónimo de Andahuaylas',
    description:
      'Crónica de la fundación virreinal (siglo XVI), doctrina colonial y memoria sagrada de la Parroquia San Jerónimo en el valle del Chumbao.',
    image: `${SITE_URL}/imagenes/DSC_0646.jpg`,
  },
  '/historia/creacion': {
    title: 'Crónica y Fundación Virreinal — Parroquia San Jerónimo',
    description:
      'Memoria histórica, doctrina colonial y libro testimonial de la Parroquia San Jerónimo ambientado con el himno sacro virreinal Hanaqpachap Kusikuynin (1631).',
    image: `${SITE_URL}/imagenes/DSC_0646.jpg`,
  },
  '/historia/arquitectura': {
    title: 'Arquitectura y Arte Virreinal — Parroquia San Jerónimo Andahuaylas',
    description:
      'Conoce el patrimonio arquitectónico de San Jerónimo: su torre exenta de piedra sillar, retablos barrocos en pan de oro, coro alto y pintura virreinal.',
    image: `${SITE_URL}/imagenes/retablo_mayor.jpg`,
  },
  '/historia/parrocos': {
    title: 'Párrocos Históricos — Parroquia San Jerónimo de Andahuaylas',
    description:
      'Sucesión pastoral y memoria testimonial de los párrocos y sacerdotes que guiaron la Doctrina de San Jerónimo desde el siglo XVI hasta hoy.',
    image: `${SITE_URL}/imagenes/DSC_0661.jpg`,
  },
  '/tramites': {
    title: 'Trámites Sacramentales y Despacho — Parroquia San Jerónimo',
    description:
      'Orientación, requisitos y expedientes eclesiásticos para la recepción de los Santos Sacramentos en la Parroquia San Jerónimo de Andahuaylas.',
    image: `${SITE_URL}/imagenes/imagenes galeria/img053.jpg`,
  },
  '/tramites/bautismo': {
    title: 'Sacramento de Bautismo: Requisitos y Trámites — Parroquia San Jerónimo',
    description:
      'Requisitos para el sacramento del Bautismo, charlas prebautismales para padres y padrinos, y documentación requerida en la Parroquia San Jerónimo.',
    image: `${SITE_URL}/imagenes/imagenes galeria/img053.jpg`,
  },
  '/tramites/matrimonio': {
    title: 'Sacramento de Matrimonio: Requisitos y Pliego — Parroquia San Jerónimo',
    description:
      'Guía paso a paso para el expediente matrimonial, pliego canónico y celebración de bodas religiosas en el Templo Matriz de San Jerónimo, Andahuaylas.',
    image: `${SITE_URL}/imagenes/imagenes galeria/img074.jpg`,
  },
  '/publicaciones': {
    title: 'Publicaciones y Cartelera Pastoral — Parroquia San Jerónimo',
    description:
      'Gaceta parroquial, noticias comunitarias, cronogramas de fe y comunicados oficiales de la Parroquia San Jerónimo de Andahuaylas.',
    image: `${SITE_URL}/imagenes/imagenes arqui/14.jpg`,
  },
  '/publicaciones/eventos': {
    title: 'Cartelera de Eventos Parroquiales — Parroquia San Jerónimo',
    description:
      'Cronograma actualizado de fiestas patronales, jornadas eucarísticas, retiros juveniles y campañas solidarias en San Jerónimo, Andahuaylas.',
    image: `${SITE_URL}/imagenes/imagenes arqui/14.jpg`,
  },
  '/publicaciones/audiovisuales': {
    title: 'Documentales y Archivo Audiovisual — Parroquia San Jerónimo',
    description:
      'Registros litúrgicos, grabaciones en video del patrimonio monumental y documentales históricos de la Parroquia San Jerónimo de Andahuaylas.',
    image: `${SITE_URL}/imagenes/imagenes arqui/20220526115812_IMG_7179.JPG`,
  },
  '/servicios': {
    title: 'Servicios Pastorales y Atención Parroquial — Parroquia San Jerónimo',
    description:
      'Horarios de despacho parroquial, intenciones de Misa, unción de los enfermos, confesiones y emisión de constancias eclesiásticas.',
    image: `${SITE_URL}/imagenes/DSC_0640.jpg`,
  },
  '/galeria': {
    title: 'Galería Fotográfica y Patrimonio Sacro — Parroquia San Jerónimo',
    description:
      'Recorrido visual en alta definición por el templo virreinal, festividades patronales, arquitectura de piedra y la comunidad de fe de San Jerónimo.',
    image: `${SITE_URL}/imagenes/imagenes galeria/img128.jpg`,
  },
  '/festividades': {
    title: 'Festividades Religiosas y Solemnidades — Parroquia San Jerónimo',
    description:
      'Calendario litúrgico anual, Semana Santa, Corpus Christi y la Solemne Fiesta Patronal de San Jerónimo Doctor en el valle del Chumbao.',
    image: `${SITE_URL}/imagenes/imagenes arqui/14.jpg`,
  },
  '/grupos-parroquiales': {
    title: 'Grupos Parroquiales y Comunidades — Parroquia San Jerónimo',
    description:
      'Conoce e intégrate a la Pastoral Juvenil, Catequesis, Hermandades, Coro Parroquial y Cáritas en la Parroquia San Jerónimo de Andahuaylas.',
    image: `${SITE_URL}/imagenes/imagenes galeria/img053.jpg`,
  },
}

/**
 * Obtiene los metadatos SEO específicos para una ruta normalizada
 */
export function getSeoForPath(path) {
  const normalized = (path || '/').toLowerCase().replace(/\/+$/, '') || '/'
  const match = SEO_ROUTES_DATA[normalized] || DEFAULT_SEO

  return {
    title: match.title || DEFAULT_SEO.title,
    description: match.description || DEFAULT_SEO.description,
    image: match.image || DEFAULT_SEO.image,
    url: `${SITE_URL}${normalized === '/' ? '' : normalized}`,
    type: DEFAULT_SEO.type,
    locale: DEFAULT_SEO.locale,
  }
}
