export const SACRAMENTS = {
  bautismo: {
    id: 'bautismo',
    tabLabel: 'Sacramento de Bautismo',
    title: 'Requisitos para el Sacramento de Bautismo',
    anticipation: 'Inscripción 1 mes antes de la fecha en la parroquia',
    requirements: [
      'Inscripción 1 mes antes de la fecha en la parroquia.',
      'Presentar partida de nacimiento y/o fotocopia de DNI (de 0 a 16 años).',
      'Partida de nacimiento (17 años a más).',
      'Presentar copia de DNI de los padrinos.',
      'Los padrinos tienen que ser casados por la Iglesia Católica (presentar partida de matrimonio católico).',
      'Padrinos solteros sin convivir (presentar partida de confirmación).',
      'Presentar constancia de charla.',
      'Si vienen de otra jurisdicción parroquial, traer constancia de preparación y autorización del párroco.',
    ],
    schedules: [
      {
        badge: 'Modalidad Entre Semana',
        days: 'Lunes y Miércoles',
        time: '05:00 PM',
        place: 'Salón Parroquial',
      },
      {
        badge: 'Modalidad Dominical',
        days: 'Domingos',
        time: '07:00 AM (Asistir a la Santa Misa y luego a charla)',
        place: 'Convento Carmelitas',
      },
    ],
    warning:
      'No adelantar en hacer las tarjetas de invitación sin haber anotado en la agenda parroquial.',
    examNote:
      'Examen y confesiones para los padres y padrinos será un día antes del bautismo.',
    talkNote:
      'La asistencia a las charlas es puntual; si tienen niños pequeños, dejarlos en casa para no distraernos.',
  },
  matrimonio: {
    id: 'matrimonio',
    tabLabel: 'Sacramento de Matrimonio',
    title: 'Requisitos para el Sacramento de Matrimonio',
    anticipation: 'Inscripción y apertura de expediente 3 meses antes',
    requirements: [
      'Inscripción y apertura de expediente matrimonial 3 meses antes de la fecha en la parroquia.',
      'Presentar partida de bautismo de los novios (actualizada).',
      'Presentar partida de confirmación de los novios (actualizada).',
      'Presentar partida de nacimiento de los novios (y copia de DNI).',
      'Presentar foto tamaño carnet (novios).',
      'Presentar copia de DNI (novios y padrinos).',
      'Los padrinos tienen que ser casados por la Iglesia Católica.',
      'Presentar partida de matrimonio de los padrinos.',
      'Recibir charlas de preparación (novios y padrinos).',
      'Presentar constancia de preparación.',
      'Si vienen de otra jurisdicción parroquial, traer constancia de preparación y autorización del párroco.',
    ],
    schedules: [
      {
        badge: 'Charlas Pre-Matrimoniales',
        days: 'Martes y Jueves',
        time: '06:00 PM',
        place: 'Salón Parroquial',
      },
    ],
    warning:
      'No adelantar en hacer las tarjetas de invitación sin haber anotado en la agenda parroquial.',
    examNote:
      'Examen y confesiones para los novios y padrinos será un día antes del matrimonio.',
    talkNote:
      'La asistencia a las charlas es puntual; si tienen niños pequeños, dejarlos en casa para no distraernos.',
  },
}
