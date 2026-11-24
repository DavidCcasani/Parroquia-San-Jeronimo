import PageShell from '../components/PageShell'

// Datos del Comedor Parroquial con fotos de referencia listas para reemplazar
const COMEDOR_DATA = {
  badge: 'Caridad y Servicio Cristiano',
  title: 'Comedor Parroquial de San Jerónimo',
  mainPhoto: '/imagenes/imagenes galeria/img051.jpg',
  description:
    'Una obra de amor y solidaridad impulsada por nuestra parroquia para brindar alimentación diaria, acogida fraterna y compañía espiritual a los adultos mayores en situación vulnerable, niños y hermanos más necesitados de nuestra comunidad.',
  cards: [
    {
      label: 'Atención Solidaria',
      title: 'Horario del Comedor',
      content: 'Lunes a Viernes (Almuerzo solidario)',
      highlight: '12:00 PM – 2:00 PM',
      featured: false,
    },
    {
      label: 'Beneficiarios',
      title: '¿A quiénes servimos?',
      content:
        'Adultos mayores, personas con discapacidad y familias vulnerables de los barrios y comunidades rurales de San Jerónimo.',
      featured: false,
    },
    {
      label: 'Manos Solidarias',
      title: '¿Cómo puedes apoyar?',
      content:
        'Puedes colaborar donando víveres no perecibles, productos agrícolas de la zona o sumándote como voluntario en el despacho parroquial.',
      featured: true,
    },
  ],
  gallery: [
    '/imagenes/imagenes galeria/img052.jpg',
    '/imagenes/imagenes galeria/img053.jpg',
    '/imagenes/imagenes galeria/img122.jpg',
  ],
}

function ServiciosPage() {
  return (
    <PageShell title="Servicios">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Bloque Principal Horizontal: Fotografía + Misión del Comedor */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 rounded-3xl border-2 border-[#c5a059]/40 bg-white shadow-xs">
          <div className="lg:col-span-6 rounded-2xl overflow-hidden border-2 border-[#c5a059] shadow-lg h-72 sm:h-80 bg-slate-100">
            <img
              src={COMEDOR_DATA.mainPhoto}
              alt={COMEDOR_DATA.title}
              loading="lazy"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 block"
            />
          </div>

          <div className="lg:col-span-6 space-y-4">
            <span className="inline-block px-3.5 py-1 rounded-full bg-[#5e1224]/10 text-[#5e1224] text-xs font-bold uppercase tracking-wider">
              {COMEDOR_DATA.badge}
            </span>
            <h2
              style={{ fontFamily: "'Roboto Slab', serif" }}
              className="text-2xl sm:text-3xl font-bold text-[#5e1224] leading-tight"
            >
              {COMEDOR_DATA.title}
            </h2>
            <div className="h-0.5 w-14 bg-[#c5a059]" />
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {COMEDOR_DATA.description}
            </p>
          </div>
        </div>

        {/* 3 Tarjetas de Información Clave */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COMEDOR_DATA.cards.map((card) => (
            <div
              key={card.title}
              className={`p-7 rounded-2xl border-2 transition-all ${
                card.featured
                  ? 'border-[#5e1224] bg-[#5e1224] text-white shadow-md'
                  : 'border-[#c5a059]/40 bg-slate-50/60 text-slate-800 hover:border-[#c5a059] hover:bg-white'
              }`}
            >
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#c5a059]">
                {card.label}
              </span>
              <h3
                style={{ fontFamily: "'Roboto Slab', serif" }}
                className={`text-lg sm:text-xl font-bold mt-1.5 ${
                  card.featured ? 'text-white' : 'text-[#5e1224]'
                }`}
              >
                {card.title}
              </h3>
              <p
                className={`text-xs sm:text-sm mt-2.5 leading-relaxed ${
                  card.featured ? 'text-white/85' : 'text-slate-600'
                }`}
              >
                {card.content}
              </p>
              {card.highlight && (
                <p className="mt-2 text-sm font-bold text-[#5e1224]">
                  {card.highlight}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Galería de Fotos de Referencia del Comedor */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {COMEDOR_DATA.gallery.map((src) => (
            <div
              key={src}
              className="group h-52 rounded-2xl overflow-hidden border-2 border-[#c5a059]/40 bg-slate-100 shadow-xs hover:border-[#5e1224] hover:shadow-md transition-all"
            >
              <img
                src={src}
                alt="Comedor Parroquial"
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 block"
              />
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  )
}

export default ServiciosPage
