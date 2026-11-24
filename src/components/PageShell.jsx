function PageShell({ title, children }) {
  return (
    <main className="w-full bg-white text-slate-800 flex-1">
      <section className="max-w-7xl mx-auto px-6 sm:px-10 py-20">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c5a059]">
            Parroquia de San Jerónimo
          </span>
          <h1
            style={{ fontFamily: "'Roboto Slab', serif" }}
            className="mt-2 text-3xl sm:text-4xl font-bold text-[#5e1224] uppercase"
          >
            {title}
          </h1>
          <div className="mt-4 mx-auto h-0.5 w-12 bg-[#c5a059]" />
        </div>

        {children || (
          <div className="min-h-[45vh] rounded-xl border-2 border-[#c5a059]/30 bg-slate-50/40 p-10 flex flex-col items-center justify-center text-center">
            <p className="text-sm text-slate-500">
              Vista de <span className="font-semibold text-[#5e1224]">{title}</span> lista para
              agregar contenido.
            </p>
          </div>
        )}
      </section>
    </main>
  )
}

export default PageShell
