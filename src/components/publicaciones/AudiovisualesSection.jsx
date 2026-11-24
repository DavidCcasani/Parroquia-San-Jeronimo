const AUDIOVISUAL_VIDEOS = [
  {
    id: 'WCe4nQ8bFJ4',
    title: 'Semana Santa 2025',
    url: 'https://youtu.be/WCe4nQ8bFJ4',
  },
  {
    id: '4Fs_unap6-E',
    title: 'Spot de Reyes 2026',
    url: 'https://youtu.be/4Fs_unap6-E',
  },
  {
    id: 'wM9eooSAlbw',
    title: 'Semana Santa 2026',
    url: 'https://youtu.be/wM9eooSAlbw',
  },
  {
    id: 'hPUR5m5jjjw',
    title: 'Semana Santa 2024',
    url: 'https://youtu.be/hPUR5m5jjjw',
  },
  {
    id: 'KWgEIUvzWpc',
    title: 'Semana Santa 2023',
    url: 'https://youtu.be/KWgEIUvzWpc',
  },
  {
    id: 'fsE5ztCrsj0',
    title: 'Semana Santa 2022',
    url: 'https://youtu.be/fsE5ztCrsj0',
  },
  {
    id: 'vdsK8eVEbN8',
    title: 'Semana Santa 2021',
    url: 'https://youtu.be/vdsK8eVEbN8',
  },
  {
    id: '9E03i2aHcyI',
    title: 'Parroquia San Jerónimo',
    url: 'https://youtu.be/9E03i2aHcyI',
  },
  {
    id: '-wafwvcVnlU',
    title: 'Corpus Christi 2022',
    url: 'https://youtu.be/-wafwvcVnlU',
  },
]

function AudiovisualesSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {AUDIOVISUAL_VIDEOS.map((video) => (
        <div
          key={video.id}
          className="rounded-2xl overflow-hidden border-2 border-[#c5a059]/40 bg-white shadow-sm hover:border-[#5e1224] hover:shadow-xl transition-all flex flex-col"
        >
          <div className="relative w-full aspect-video bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${video.id}`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>
          <div className="p-5 flex items-center justify-between gap-3 bg-white">
            <h3
              style={{ fontFamily: "'Roboto Slab', serif" }}
              className="text-base sm:text-lg font-bold text-[#5e1224]"
            >
              {video.title}
            </h3>
            <a
              href={video.url}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-[#c5a059] hover:text-[#5e1224] transition-colors shrink-0"
            >
              Ver en YouTube &rarr;
            </a>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AudiovisualesSection
