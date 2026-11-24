function MassSchedulesSection() {
  return (
    <section id="horarios" className="max-w-7xl mx-auto px-6 sm:px-10 py-24">
      <div className="text-center mb-16">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c5a059]">
          Celebraciones Litúrgicas
        </span>
        <h2
          style={{ fontFamily: "'Roboto Slab', serif" }}
          className="mt-2 text-2xl sm:text-3xl font-bold text-[#5e1224]"
        >
          Horarios de Misas
        </h2>
        <div className="mt-4 mx-auto h-0.5 w-12 bg-[#c5a059]" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Lunes a Viernes */}
        <div className="p-8 rounded-xl border-2 border-[#c5a059]/45 bg-slate-50/40 flex flex-col justify-between transition-colors hover:border-[#c5a059]">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#5e1224] text-center pb-4 border-b-2 border-[#c5a059]/25">
              Lunes a Viernes
            </h3>
            <ul className="mt-6 space-y-5">
              <li className="flex flex-col items-center text-center">
                <span className="text-2xl font-light text-slate-900">06:30 AM</span>
                <span className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500">
                  Convento Carmelitas
                </span>
              </li>
              <li className="flex flex-col items-center text-center">
                <span className="text-2xl font-light text-slate-900">06:30 PM</span>
                <span className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500">
                  Templo
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Sábados */}
        <div className="p-8 rounded-xl border-2 border-[#c5a059]/45 bg-slate-50/40 flex flex-col justify-between transition-colors hover:border-[#c5a059]">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#5e1224] text-center pb-4 border-b-2 border-[#c5a059]/25">
              Sábados
            </h3>
            <ul className="mt-6 space-y-5">
              <li className="flex flex-col items-center text-center">
                <span className="text-2xl font-light text-slate-900">07:00 AM</span>
                <span className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500">
                  Convento Carmelitas
                </span>
              </li>
              <li className="flex flex-col items-center text-center">
                <span className="text-2xl font-light text-slate-900">06:30 PM</span>
                <span className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500">
                  Templo
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Domingos (Tarjeta principal destacada en #c5a059 con borde dorado) */}
        <div className="p-8 rounded-xl border-2 border-[#c5a059] bg-[#c5a059] text-white shadow-md flex flex-col justify-between transition-colors hover:border-[#c5a059]">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#5e1224] text-center pb-4 border-b-2 border-[#5e1224]/25">
              Domingos
            </h3>
            <ul className="mt-6 space-y-4">
              <li className="flex flex-col items-center text-center">
                <span className="text-xl font-light text-white">05:30 AM</span>
                <span className="mt-0.5 text-xs font-medium uppercase tracking-wider text-white/85">
                  Templo
                </span>
              </li>
              <li className="flex flex-col items-center text-center">
                <span className="text-xl font-light text-white">07:00 AM</span>
                <span className="mt-0.5 text-xs font-medium uppercase tracking-wider text-white/85">
                  Convento Carmelitas
                </span>
              </li>
              <li className="flex flex-col items-center text-center">
                <span className="text-xl font-light text-white">09:30 AM</span>
                <span className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-[#5e1224]">
                  Templo (Quechua)
                </span>
              </li>
              <li className="flex flex-col items-center text-center">
                <span className="text-xl font-light text-white">06:30 PM</span>
                <span className="mt-0.5 text-xs font-medium uppercase tracking-wider text-white/85">
                  Templo
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MassSchedulesSection
