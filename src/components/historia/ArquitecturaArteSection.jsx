import { ARQUITECTURA_IMAGES } from './historiaData'

function ArquitecturaArteSection({ onSelectImage }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {ARQUITECTURA_IMAGES.map((img) => (
        <div
          key={img.src}
          onClick={() =>
            onSelectImage({
              src: img.src,
              title: 'Arquitectura y Arte',
              category: 'Patrimonio Parroquial',
              caption: img.caption,
            })
          }
          className="group rounded-2xl overflow-hidden border-2 border-[#c5a059]/40 bg-white shadow-xs hover:border-[#5e1224] hover:shadow-lg transition-all cursor-pointer flex flex-col"
        >
          <div className="relative h-64 w-full overflow-hidden bg-slate-100">
            <img
              src={img.src}
              alt={img.caption}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="p-4 bg-white">
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {img.caption}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ArquitecturaArteSection
