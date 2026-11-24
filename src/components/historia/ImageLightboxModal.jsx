function ImageLightboxModal({ selectedImage, onClose }) {
  if (!selectedImage) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden border-2 border-[#c5a059] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative max-h-[75vh] overflow-hidden bg-black flex items-center justify-center">
          <img
            src={selectedImage.src}
            alt={selectedImage.title}
            className="max-h-[75vh] w-auto object-contain"
          />
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-[#5e1224] transition-colors cursor-pointer text-sm font-bold"
          >
            ✕
          </button>
        </div>
        <div className="p-6 bg-white border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#c5a059]">
              {selectedImage.category || 'Archivo Parroquial'}
            </span>
            <h4 className="text-base font-bold text-[#5e1224] mt-0.5">
              {selectedImage.title}
            </h4>
            <p className="text-xs text-slate-600 mt-1 max-w-xl">
              {selectedImage.caption}
            </p>
          </div>
          <a
            href={selectedImage.src}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#5e1224] text-[#c5a059] text-xs font-bold uppercase tracking-wider hover:bg-[#480d1b] transition-colors shrink-0"
          >
            Abrir original &rarr;
          </a>
        </div>
      </div>
    </div>
  )
}

export default ImageLightboxModal
