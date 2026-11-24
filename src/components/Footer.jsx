function Footer({ onNavigate }) {
  return (
    <footer className="w-full bg-[#5e1224] text-white/90 py-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-sm">
        <a href="/" onClick={(e) => onNavigate(e, '/')}>
          <img
            src="/imagenes/logo principal.png"
            alt="Parroquia de San Jerónimo"
            className="h-20 sm:h-24 w-auto object-contain"
          />
        </a>
        <p className="text-white/80">
          &copy; {new Date().getFullYear()} Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}

export default Footer
