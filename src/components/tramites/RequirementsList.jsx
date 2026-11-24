function RequirementsList({ title, requirements }) {
  return (
    <div className="lg:col-span-7 p-8 sm:p-10 rounded-xl border-2 border-[#c5a059]/50 bg-white shadow-xs">
      <div className="pb-6 border-b-2 border-[#c5a059]/25">
        <span className="inline-block text-[11px] font-semibold uppercase tracking-widest text-[#c5a059]">
          Documentación y Condiciones
        </span>
        <h2
          style={{ fontFamily: "'Roboto Slab', serif" }}
          className="mt-1 text-xl sm:text-2xl font-bold text-[#5e1224] uppercase"
        >
          {title}
        </h2>
      </div>

      <ol className="mt-6 space-y-4">
        {requirements.map((req, index) => (
          <li
            key={req}
            className="flex items-start gap-4 p-3 rounded-lg transition-colors hover:bg-slate-50"
          >
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#c5a059] text-white text-xs font-bold flex items-center justify-center mt-0.5">
              {index + 1}
            </span>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              {req}
            </p>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default RequirementsList
