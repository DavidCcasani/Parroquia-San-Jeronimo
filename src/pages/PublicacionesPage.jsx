import PageShell from '../components/PageShell'
import EventosSection from '../components/publicaciones/EventosSection'
import AudiovisualesSection from '../components/publicaciones/AudiovisualesSection'

function PublicacionesPage({ activePublicacion }) {
  const current = activePublicacion || 'eventos'

  return (
    <PageShell title="Publicaciones">
      {current === 'audiovisuales' ? <AudiovisualesSection /> : <EventosSection />}
    </PageShell>
  )
}

export default PublicacionesPage
