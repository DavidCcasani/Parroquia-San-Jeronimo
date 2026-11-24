const FEATURED_POSTS = [
  {
    tag: 'Aviso Parroquial',
    title: 'Inscripciones abiertas para Catequesis Sacramental',
    date: 'Esta semana',
    desc: 'Acércate al despacho parroquial para conocer los requisitos de Primera Comunión y Confirmación.',
  },
  {
    tag: 'Comunidad',
    title: 'Jornada de oración y adoración al Santísimo',
    date: 'Jueves Eucarístico',
    desc: 'Invitamos a toda la comunidad de San Jerónimo a compartir un momento de recogimiento y fe.',
  },
  {
    tag: 'Patrimonio',
    title: 'Historia y tradición de nuestro templo colonial',
    date: 'Crónica',
    desc: 'Conoce más sobre el legado histórico y arquitectónico que resguarda nuestra parroquia en Andahuaylas.',
  },
]

function FeaturedPostsSection({ onNavigate }) {
  return (
    <section id="publicaciones" className="w-full bg-[#5e1224] text-white py-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c5a059]">
            Actualidad Parroquial
          </span>
          <h2
            style={{ fontFamily: "'Roboto Slab', serif" }}
            className="mt-2 text-2xl sm:text-3xl font-bold text-white"
          >
            Publicaciones Destacadas
          </h2>
          <div className="mt-4 mx-auto h-0.5 w-12 bg-[#c5a059]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURED_POSTS.map((post) => (
            <article
              key={post.title}
              className="flex flex-col justify-between p-7 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xs transition-all hover:border-[#c5a059]/60 hover:bg-white/[0.08]"
            >
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-widest text-[#c5a059]">
                  {post.tag}
                </span>
                <h3 className="mt-3 text-lg font-semibold text-white leading-snug">
                  {post.title}
                </h3>
                <p className="mt-3 text-sm text-white/75 leading-relaxed">{post.desc}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
                <span>{post.date}</span>
                <a
                  href="/publicaciones"
                  onClick={(e) => onNavigate(e, '/publicaciones')}
                  className="font-medium text-[#c5a059] hover:underline"
                >
                  Leer más &rarr;
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedPostsSection
