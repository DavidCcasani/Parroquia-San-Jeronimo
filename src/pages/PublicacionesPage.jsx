import PageShell from '../components/PageShell'
import EventosSection from '../components/publicaciones/EventosSection'
import AudiovisualesSection from '../components/publicaciones/AudiovisualesSection'

function PublicacionesPage({ activePublicacion, onNavigate }) {
  const current = activePublicacion || 'eventos'

  return (
    <PageShell title="Publicaciones">
      {current === 'audiovisuales' ? (
        <AudiovisualesSection />
      ) : (
        <EventosSection onNavigate={onNavigate} />
      )}
    </PageShell>
  )
}

export default PublicacionesPage
