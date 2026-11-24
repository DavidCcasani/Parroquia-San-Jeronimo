function IntroCurtain({ isCurtainUp, durationMs = 1500 }) {
  return (
    <div
      style={{ transitionDuration: `${durationMs}ms` }}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#5e1224] px-6 text-center select-none will-change-transform transition-transform ease-[cubic-bezier(0.76,0,0.24,1)] shadow-[0_20px_50px_rgba(0,0,0,0.6)] ${isCurtainUp ? '-translate-y-[105%] pointer-events-none' : 'translate-y-0'
        }`}
    >
      <div
        style={{ transitionDuration: `${Math.round(durationMs * 0.8)}ms` }}
        className={`flex flex-col items-center transition-all ease-[cubic-bezier(0.76,0,0.24,1)] ${isCurtainUp
            ? '-translate-y-10 opacity-0 scale-95'
            : 'translate-y-0 opacity-100 scale-100'
          }`}
      >
        <img
          src="/imagenes/logo principal dorado.png"
          alt="Parroquia de San Jerónimo"
          className="w-64 sm:w-80 md:w-96 object-contain drop-shadow-[0_6px_24px_rgba(0,0,0,0.6)]"
        />
        <p
          style={{ fontFamily: "'Roboto Slab', serif" }}
          className="mt-5 max-w-3xl text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-wider text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
        >
          &ldquo;Siglos de historia, fe y tradicion en nuestro pueblo.&rdquo;
        </p>
      </div>
    </div>
  )
}

export default IntroCurtain
