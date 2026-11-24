import { useState } from 'react'
import PageShell from '../components/PageShell'
import ImageLightboxModal from '../components/historia/ImageLightboxModal'
import CreacionHistoriaSection from '../components/historia/CreacionHistoriaSection'
import ArquitecturaArteSection from '../components/historia/ArquitecturaArteSection'
import ParrocosHistoricosSection from '../components/historia/ParrocosHistoricosSection'
import HistoriaAudioPlayer from '../components/historia/HistoriaAudioPlayer'

function HistoriaPage({ activeChapter: propChapter }) {
  const activeChapter = propChapter || 'creacion'
  const [selectedImage, setSelectedImage] = useState(null)

  return (
    <PageShell title="Historia">
      <div className="space-y-8">
        {/* Música sacra andina (Hanaqpachap Kusikuynin) exclusiva de la vista Historia */}
        <HistoriaAudioPlayer />

        <ImageLightboxModal
          selectedImage={selectedImage}
          onClose={() => setSelectedImage(null)}
        />

        {activeChapter === 'creacion' && (
          <CreacionHistoriaSection onSelectImage={setSelectedImage} />
        )}

        {activeChapter === 'arquitectura' && (
          <ArquitecturaArteSection onSelectImage={setSelectedImage} />
        )}

        {activeChapter === 'parrocos' && (
          <ParrocosHistoricosSection onSelectImage={setSelectedImage} />
        )}
      </div>
    </PageShell>
  )
}

export default HistoriaPage
