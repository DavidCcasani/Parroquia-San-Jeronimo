function PreparationSchedules({ schedules, talkNote, warning, examNote }) {
  return (
    <div className="lg:col-span-5 space-y-6">
      {/* Tarjeta de Horario de Preparación */}
      <div className="p-8 rounded-xl border-2 border-[#c5a059]/45 bg-slate-50/40">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#c5a059]">
          Charlas Catequéticas
        </span>
        <h3
          style={{ fontFamily: "'Roboto Slab', serif" }}
          className="mt-1 text-lg sm:text-xl font-bold text-[#5e1224] uppercase pb-4 border-b-2 border-[#c5a059]/25"
        >
          Horario de Preparación
        </h3>

        <div className="mt-6 divide-y divide-slate-200/80">
          {schedules.map((sched, idx) => (
            <div key={sched.days} className={idx > 0 ? 'pt-6 mt-6' : ''}>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#5e1224]">
                {sched.days}
              </p>
              <p className="mt-1.5 text-xl font-light text-slate-900">
                {sched.time}
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-[#c5a059]">
                Lugar: <span className="text-slate-600">{sched.place}</span>
              </p>
            </div>
          ))}
        </div>

        <p className="mt-6 pt-5 border-t border-slate-200/80 text-xs text-slate-500 leading-relaxed">
          <span className="font-semibold text-[#5e1224] uppercase tracking-wider">
            Nota:{' '}
          </span>
          {talkNote}
        </p>
      </div>

      {/* Tarjeta de Notas Importantes */}
      <div className="p-8 rounded-xl border-2 border-[#c5a059]/45 bg-white space-y-5">
        <h4
          style={{ fontFamily: "'Roboto Slab', serif" }}
          className="text-sm font-bold uppercase tracking-wider text-[#5e1224] pb-3 border-b-2 border-[#c5a059]/25"
        >
          Notas Importantes
        </h4>

        <div className="border-l-2 border-[#5e1224] pl-4">
          <p className="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed">
            {warning}
          </p>
        </div>

        <div className="border-l-2 border-[#c5a059] pl-4">
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            <span className="font-semibold text-[#5e1224] uppercase tracking-wider text-xs block mb-0.5">
              Examen y Confesiones
            </span>
            {examNote}
          </p>
        </div>
      </div>
    </div>
  )
}

export default PreparationSchedules
