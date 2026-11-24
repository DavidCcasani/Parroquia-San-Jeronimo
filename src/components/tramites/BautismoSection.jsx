import { SACRAMENTS } from './tramitesData'
import RequirementsList from './RequirementsList'
import PreparationSchedules from './PreparationSchedules'

function BautismoSection() {
  const data = SACRAMENTS.bautismo

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <RequirementsList title={data.title} requirements={data.requirements} />
      <PreparationSchedules
        schedules={data.schedules}
        talkNote={data.talkNote}
        warning={data.warning}
        examNote={data.examNote}
      />
    </div>
  )
}

export default BautismoSection
