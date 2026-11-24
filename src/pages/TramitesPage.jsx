import PageShell from '../components/PageShell'
import BautismoSection from '../components/tramites/BautismoSection'
import MatrimonioSection from '../components/tramites/MatrimonioSection'

function TramitesPage({ activeTab: controlledTab }) {
  const activeTab = controlledTab || 'bautismo'

  return (
    <PageShell title="Trámites">
      {activeTab === 'matrimonio' ? <MatrimonioSection /> : <BautismoSection />}
    </PageShell>
  )
}

export default TramitesPage
