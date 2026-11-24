function LocationContactSection() {
  return (
    <section id="ubicacion" className="max-w-7xl mx-auto px-6 sm:px-10 py-24">
      <div className="text-center mb-16">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c5a059]">
          Encuéntranos
        </span>
        <h2
          style={{ fontFamily: "'Roboto Slab', serif" }}
          className="mt-2 text-2xl sm:text-3xl font-bold text-[#5e1224]"
        >
          Ubicación y Contactos
        </h2>
        <div className="mt-4 mx-auto h-0.5 w-12 bg-[#c5a059]" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* Tarjeta lateral #c5a059 con texto blanco y guinda #5e1224 */}
        <div className="p-8 sm:p-10 rounded-xl bg-[#c5a059] text-white border-2 border-[#c5a059] shadow-md flex flex-col justify-between space-y-8">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#5e1224]">
              Dirección
            </h3>
            <p className="mt-2 text-base sm:text-lg font-medium text-white">
              Plaza de Armas de San Jerónimo, Andahuaylas — Apurímac
            </p>
          </div>

          <div className="pt-6 border-t border-[#5e1224]/20">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#5e1224]">
              Atención en Despacho Parroquial
            </h3>
            <p className="mt-2 text-sm text-white/95">
              Lunes a Sábado: 9:00 AM – 12:30 PM / 3:30 PM – 6:00 PM
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-[#5e1224]/20">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[#5e1224]">
                Teléfono / WhatsApp
              </h3>
              <p className="mt-2 text-sm text-white/95">+51 (083) 000-000</p>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[#5e1224]">
                Correo Electrónico
              </h3>
              <p className="mt-2 text-sm text-white/95 break-all">
                contacto@parroquiasanjeronimo.org
              </p>
            </div>
          </div>
        </div>

        {/* Mapa minimalista */}
        <div className="w-full min-h-[300px] h-full rounded-xl overflow-hidden border-2 border-[#c5a059]/45 bg-slate-50">
          <iframe
            title="Ubicación Parroquia San Jerónimo"
            src="https://www.google.com/maps?q=Parroquia+San+Jeronimo+Andahuaylas&output=embed"
            className="w-full h-full border-0 grayscale contrast-95 opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  )
}

export default LocationContactSection
