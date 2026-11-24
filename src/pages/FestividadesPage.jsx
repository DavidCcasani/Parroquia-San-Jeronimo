import PageShell from '../components/PageShell'

// Lista cronológica de Festividades con fotos de referencia listas para reemplazar
const FESTIVIDADES_ANUALES = [
  {
    id: 'bajada-de-reyes',
    day: '06',
    month: 'ENERO',
    title: 'Bajada de Reyes',
    photo: '/imagenes/imagenes galeria/img121.jpg',
    desc: 'Tradicional adoración al Niño Jesús con la participación de familias, cuadrillas y danzantes de la comunidad jeronimiana que acompañan la procesión y la Santa Misa.',
  },
  {
    id: 'semana-santa',
    day: 'MAR',
    month: 'ABRIL',
    title: 'Semana Santa en San Jerónimo',
    photo: '/imagenes/imagenes galeria/img129.jpg',
    desc: 'Días solemnes de recogimiento, Vía Crucis, Sermón de las Siete Palabras, procesión del Cristo de la Pasión y del Santo Sepulcro, culminando con la Vigilia Pascual de Resurrección.',
  },
  {
    id: 'corpus-christi',
    day: 'MES',
    month: 'JUNIO',
    title: 'Solemnidad de Corpus Christi',
    photo: '/imagenes/imagenes galeria/img187.jpg',
    desc: 'Adoración y procesión solemne del Santísimo Sacramento alrededor de la Plaza de Armas sobre alfombras florales elaboradas por las instituciones, barrios y grupos parroquiales.',
  },
  {
    id: 'virgen-del-carmen',
    day: '16',
    month: 'JULIO',
    title: 'Festividad de la Virgen del Carmen',
    photo: '/imagenes/imagenes galeria/img224.jpg',
    desc: 'Celebraciones eucarísticas, novenas y procesión mariana en comunión espiritual con el Convento de las Madres Carmelitas y la feligresía del valle.',
  },
  {
    id: 'san-jeronimo',
    day: '30',
    month: 'SEPT',
    title: 'Fiesta Patronal de San Jerónimo',
    photo: '/imagenes/imagenes arqui/WhatsApp Image 2025-09-05 at 12.06.19 PM (1).jpeg',
    desc: 'Solemnidad central de nuestro santo patrono y Doctor de la Iglesia. Congrega a todo el pueblo con novenas, vísperas, misa central concelebrada y procesión por la Plaza de Armas.',
  },
  {
    id: 'senor-de-los-milagros',
    day: 'MES',
    month: 'OCTUBRE',
    title: 'Mes del Señor de los Milagros',
    photo: '/imagenes/imagenes galeria/img248.jpg',
    desc: 'Recorridos procesionales y misas devocionales junto a la hermandad y fieles devotos del Cristo Moreno.',
  },
  {
    id: 'inmaculada-y-navidad',
    day: '24–25',
    month: 'DIC',
    title: 'Natividad del Señor y Misa de Gallo',
    photo: '/imagenes/imagenes galeria/JULIO-3.jpg',
    desc: 'Tiempo de Adviento, celebración de la Inmaculada Concepción y la tradicional Misa de Gallo en la Nochebuena celebrando el nacimiento del Salvador.',
  },
]

function FestividadesPage() {
  return (
    <PageShell title="Festividades Religiosas">
      <div className="max-w-5xl mx-auto space-y-5">
        {FESTIVIDADES_ANUALES.map((fest) => (
          <article
            key={fest.id}
            className="group flex flex-col md:flex-row items-center gap-6 p-5 sm:p-6 rounded-2xl border-2 border-[#c5a059]/40 bg-white shadow-xs hover:border-[#5e1224] hover:shadow-lg transition-all"
          >
            {/* Medallón / Insignia de Fecha */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#5e1224] text-[#c5a059] border-2 border-[#c5a059] flex flex-col items-center justify-center shrink-0 shadow-md">
              <span
                style={{ fontFamily: "'Roboto Slab', serif" }}
                className="text-xl sm:text-2xl font-extrabold leading-none"
              >
                {fest.day}
              </span>
              <span className="text-[11px] font-bold uppercase tracking-widest mt-1.5 text-white/90">
                {fest.month}
              </span>
            </div>

            {/* Fotografía de referencia */}
            <div className="w-full md:w-56 h-44 md:h-36 rounded-xl overflow-hidden border border-[#c5a059]/40 bg-slate-100 shrink-0">
              <img
                src={fest.photo}
                alt={fest.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 block"
              />
            </div>

            {/* Título y Descripción */}
            <div className="flex-1 text-center md:text-left">
              <h2
                style={{ fontFamily: "'Roboto Slab', serif" }}
                className="text-lg sm:text-xl font-bold text-[#5e1224] leading-snug"
              >
                {fest.title}
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                {fest.desc}
              </p>
            </div>
          </article>
        ))}
      </div>
    </PageShell>
  )
}

export default FestividadesPage
