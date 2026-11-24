import PageShell from '../components/PageShell'

// Lista de Grupos Parroquiales con fotos de referencia listas para reemplazar
const GRUPOS_PARROQUIALES = [
  {
    id: 'pastoral-juvenil',
    name: 'Pastoral Juvenil',
    photo: '/imagenes/imagenes galeria/39.jpg',
    desc: 'Comunidad de jóvenes comprometidos con el anuncio del Evangelio, la formación espiritual, el apostolado misionero en los barrios y anexos de San Jerónimo, y la animación de vigilias y encuentros juveniles.',
  },
  {
    id: 'hermandad-san-jeronimo',
    name: 'Hermandad de San Jerónimo',
    photo: '/imagenes/imagenes galeria/52.jpg',
    desc: 'Fieles y devotos encargados de custodiar la sagrada imagen patronal del Doctor de la Iglesia, organizar las novenas, procesiones solemnes y preservar las tradiciones de fe de nuestro distrito.',
  },
  {
    id: 'catequistas',
    name: 'Catequistas Parroquiales',
    photo: '/imagenes/imagenes galeria/54.jpg',
    desc: 'Equipo de agentes pastorales dedicados a la formación doctrinal y espiritual de niños, jóvenes y adultos que se preparan para recibir los sacramentos de Bautismo, Primera Comunión y Confirmación.',
  },
  {
    id: 'coro-parroquial',
    name: 'Coro y Ministerio de Música',
    photo: '/imagenes/imagenes galeria/img007.jpg',
    desc: 'Ministerio encargado de solemnizar y animar la liturgia mediante el canto sacro y tradicional andino en las misas dominicales, fiestas patronales y celebraciones eucarísticas.',
  },
  {
    id: 'liturgia-acolitos',
    name: 'Equipo de Liturgia y Acólitos',
    photo: '/imagenes/imagenes galeria/img027.jpg',
    desc: 'Servidores del altar y proclamadores de la Palabra que colaboran directamente con los sacerdotes en el cuidado del culto divino, la preparación de los ornamentos y el orden de las celebraciones.',
  },
  {
    id: 'caritas-pastoral-social',
    name: 'Cáritas y Pastoral Social',
    photo: '/imagenes/imagenes galeria/img051.jpg',
    desc: 'Voluntariado parroquial dedicado a la caridad cristiana, llevando ayuda fraterna, acompañamiento espiritual y apoyo alimentario a los ancianos, enfermos y familias más vulnerables de la comunidad.',
  },
]

function GruposParroquialesPage() {
  return (
    <PageShell title="Grupos Parroquiales">
      <div className="space-y-8 max-w-5xl mx-auto">
        {GRUPOS_PARROQUIALES.map((group, idx) => {
          const isReverse = idx % 2 === 1

          return (
            <article
              key={group.id}
              className={`group rounded-2xl overflow-hidden border-2 border-[#c5a059]/40 bg-white shadow-sm hover:border-[#5e1224] hover:shadow-xl transition-all flex flex-col ${
                isReverse ? 'md:flex-row-reverse' : 'md:flex-row'
              }`}
            >
              {/* Fotografía de referencia del grupo */}
              <div className="md:w-5/12 relative min-h-[240px] sm:min-h-[260px] overflow-hidden bg-slate-100 shrink-0">
                <img
                  src={group.photo}
                  alt={group.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 block"
                />
              </div>

              {/* Descripción del grupo parroquial */}
              <div className="md:w-7/12 p-7 sm:p-10 flex flex-col justify-center">
                <h2
                  style={{ fontFamily: "'Roboto Slab', serif" }}
                  className="text-xl sm:text-2xl font-bold text-[#5e1224] leading-snug"
                >
                  {group.name}
                </h2>
                <div className="mt-3 mb-4 h-0.5 w-12 bg-[#c5a059]" />
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {group.desc}
                </p>
              </div>
            </article>
          )
        })}
      </div>
    </PageShell>
  )
}

export default GruposParroquialesPage
