import MassSchedulesSection from '../components/home/MassSchedulesSection'
import FeaturedPostsSection from '../components/home/FeaturedPostsSection'
import LocationContactSection from '../components/home/LocationContactSection'

function HomePage({ onNavigate }) {
  return (
    <main className="w-full bg-white text-slate-800 flex-1">
      <MassSchedulesSection />
      <FeaturedPostsSection onNavigate={onNavigate} />
      <LocationContactSection />
    </main>
  )
}

export default HomePage
