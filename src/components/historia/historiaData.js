export const CHAPTERS = [
  { id: 'creacion', label: 'Creación e Historia' },
  { id: 'arquitectura', label: 'Arquitectura y Arte' },
  { id: 'parrocos', label: 'Párrocos Históricos' },
]

// Lista de Párrocos para el camino serpenteante vertical (fotos de referencia listas para reemplazar)
export const PARROCOS_HISTORICOS = [
  {
    id: 'parroco-1',
    name: 'Pbro. Fray Jerónimo de Loayza y Mendoza',
    photo: '/imagenes/imagenes historia/7.jpg',
    bio: 'Nacido en Sevilla y ordenado sacerdote en Lima en 1572. Llegó al valle del Chumbao como misionero doctrinero, aprendió el quechua chanka para evangelizar a las familias locales y dedicó más de treinta años de su vida pastoral al servicio espiritual de San Jerónimo.',
  },
  {
    id: 'parroco-2',
    name: 'Pbro. Gaspar de Villarroel y Ordóñez',
    photo: '/imagenes/imagenes historia/40.jpg',
    bio: 'Sacerdote natural del Cusco, formado en el Seminario de San Antonio Abad. Fue párroco de San Jerónimo durante casi cuatro décadas, recordado por su profunda caridad con los enfermos, su predicación bilingüe y su celo por la dignidad de la liturgia.',
  },
  {
    id: 'parroco-3',
    name: 'Pbro. Mariano de los Santos Cáceres',
    photo: '/imagenes/imagenes historia/IMG_20200926_172212553.jpg',
    bio: 'Originario de Huamanga y ordenado en 1818. Asumió la conducción de la parroquia en tiempos de la independencia, acompañando espiritualmente a las comunidades campesinas, promoviendo la educación cristiana de los niños y socorriendo a los más necesitados.',
  },
  {
    id: 'parroco-4',
    name: 'Pbro. Andrés Avelino Palomino',
    photo: '/imagenes/imagenes historia/img168.jpg',
    bio: 'Nacido en Andahuaylas en 1888, ordenado sacerdote a los 25 años. Pastoreó la parroquia con incansable vocación misionera, recorriendo a caballo cada anexo y comunidad rural para llevar los sacramentos y fortalecer la unión de las familias.',
  },
  {
    id: 'parroco-5',
    name: 'Pbro. Víctor Raúl Huamán Altamirano',
    photo: '/imagenes/imagenes galeria/img070.jpg',
    bio: 'Sacerdote apurimeño ordenado en 1970. Destacó por su cercanía humana, su labor pastoral en lengua quechua, la formación de catequistas rurales y la creación de obras sociales en favor de los ancianos y niños de la jurisdicción parroquial.',
  },
  {
    id: 'parroco-6',
    name: 'Pbro. José Luis Altamirano',
    photo: '/imagenes/imagenes galeria/img074.jpg',
    bio: 'Formado en el Seminario Mayor Nuestra Señora de Cocharcas de Abancay. Sacerdote entregado a la dirección espiritual, la formación de la juventud, el acompañamiento de los grupos parroquiales y la celebración viva de la fe en San Jerónimo.',
  },
]

export const CREACION_STAGES = [
  {
    step: '01',
    bg: '#6d1f2f',
    fg: '#f5efe1',
    category: 'Historia y doctrina colonial',
    title: 'La doctrina colonial y su plaza',
    paragraph:
      'Fundada en la comarca Chanka en la segunda mitad del siglo XVI. El trazo de la plaza, su arboleda y el templo matriz constituyeron el corazón de la fe y la vida civil en el valle de Andahuaylas.',
    buttonText: 'Conoce los orígenes',
    image: '/imagenes/imagenes historia/7.jpg',
    imageTitle: 'Vista histórica de la plaza y templo',
    imageCaption:
      'Perspectiva histórica de la Plaza Principal de San Jerónimo con su arboleda, el templo y el campanario virreinal exento.',
  },
  {
    step: '02',
    bg: '#d6a846',
    fg: '#1c1512',
    category: 'Memoria y arquitectura',
    title: 'El campanario exento de sillar',
    paragraph:
      'Levantado con sillares de piedra labrada y calicanto. Su torre campanario exenta de tres vanos, separada del templo para resistir los movimientos sísmicos andinos, se erige como vigía espiritual del valle.',
    buttonText: 'Conoce su estructura',
    image: '/imagenes/imagenes historia/40.jpg',
    imageTitle: 'Torre campanario y entorno histórico',
    imageCaption:
      'Registro fotográfico histórico del templo y su torre campanario de tres vanos de medio punto frente a la plaza.',
  },
  {
    step: '03',
    bg: '#2f5b46',
    fg: '#f5efe1',
    category: 'Cantería y bienvenida',
    title: 'El umbral sagrado y portón virreinal',
    paragraph:
      'El arco de medio punto de piedra labrada y el portón monumental de madera noble tachonada marcan el paso solemne entre la vida cotidiana del pueblo y la intimidad del recinto sagrado.',
    buttonText: 'Recorre sus detalles',
    image: '/imagenes/imagenes historia/IMG_20200926_172212553.jpg',
    imageTitle: 'Portón colonial y umbral hacia la plaza',
    imageCaption:
      'Perspectiva desde el interior del templo a través del portón colonial de madera tachonada hacia el atrio y la plaza.',
  },
  {
    step: '04',
    bg: '#e6c2a8',
    fg: '#1c1512',
    category: 'Campanas y tradición',
    title: 'Voz de bronce en el valle',
    paragraph:
      'Fundidas en la época virreinal, las campanas de San Jerónimo doblan en las solemnidades, anuncian el ángelus y convocan a la asamblea litúrgica de toda la feligresía chanka.',
    buttonText: 'Descubrir tradición',
    image: '/imagenes/imagenes historia/img168.jpg',
    imageTitle: 'Campanario y campanas al atardecer',
    imageCaption:
      'El campanario virreinal con sus campanas centenarias de bronce recortadas contra el cielo del valle de Chumbao.',
  },
  {
    step: '05',
    bg: '#2c4566',
    fg: '#f5efe1',
    category: 'Patrimonio vivo',
    title: 'El templo y su atrio hoy',
    paragraph:
      'La fachada encalada, la portada de sillar, la cruz atrial y el amplio pavimento de piedra continúan congregando a las familias de San Jerónimo en una fe viva que custodia su legado histórico.',
    buttonText: 'Ver el patrimonio',
    image: '/imagenes/imagenes historia/WhatsApp Image 2025-09-05 at 12.09.18 PM (3).jpeg',
    imageTitle: 'Atrio y fachada principal actual',
    imageCaption:
      'Vista actual del atrio adoquinado, la portada de piedra y la fachada del Templo Parroquial de San Jerónimo.',
  },
]

export const ARQUITECTURA_IMAGES = [
  {
    src: '/imagenes/imagenes arqui/14.jpg',
    caption: 'Efigie colonial de San Jerónimo con manto verde bordado en oro y maqueta del templo.',
  },
  {
    src: '/imagenes/imagenes arqui/20220526115751_IMG_7176.JPG',
    caption: 'Pintura mural virreinal en el arco del coro con motivos florales en rojo y azul.',
  },
  {
    src: '/imagenes/imagenes arqui/20220526115812_IMG_7179.JPG',
    caption: 'Balcón del coro alto con reja de hierro forjado y cenefa mural colonial.',
  },
  {
    src: '/imagenes/imagenes arqui/20220526115908_IMG_7183.JPG',
    caption: 'Arco rebajado del sotocoro decorado con flores y estrellas policromadas.',
  },
  {
    src: '/imagenes/imagenes arqui/20220526115951_IMG_7184.JPG',
    caption: 'Detalle central del fresco mural con flor de ocho pétalos y roleos coloniales.',
  },
  {
    src: '/imagenes/imagenes arqui/20220526120009_IMG_7185.JPG',
    caption: 'Vista inferior de la baranda de forja artística y friso pictórico del coro.',
  },
  {
    src: '/imagenes/imagenes arqui/20220526120148_IMG_7187.JPG',
    caption: 'Tachón de bronce fundido con figura de ave labrada sobre el portón de madera.',
  },
  {
    src: '/imagenes/imagenes arqui/20220526120241_IMG_7191.JPG',
    caption: 'Clavo ornamental virreinal en relieve de bronce con plumaje cincelado.',
  },
  {
    src: '/imagenes/imagenes arqui/20220526120359_IMG_7193.JPG',
    caption: 'Detalle de perfil del herraje zoomorfo en bronce sobre la puerta principal.',
  },
  {
    src: '/imagenes/imagenes arqui/20220526120453_IMG_7195.JPG',
    caption: 'Hilera de tachones coloniales de bronce que guarnecen los batientes del portón.',
  },
  {
    src: '/imagenes/imagenes arqui/20220526120517_IMG_7196.JPG',
    caption: 'Primer plano del cincelado artesanal de la clavazón virreinal en bronce.',
  },
  {
    src: '/imagenes/imagenes arqui/20220526120530_IMG_7197.JPG',
    caption: 'Relieve superior del tachón de bronce con cabeza de ave sobre madera noble.',
  },
  {
    src: '/imagenes/imagenes arqui/20220526120601_IMG_7198.JPG',
    caption: 'Vista lateral del herraje de bronce patinado en el portón del templo.',
  },
  {
    src: '/imagenes/imagenes arqui/20220526120618_IMG_7199.JPG',
    caption: 'Detalle de las alas labradas en bronce de la clavazón histórica.',
  },
  {
    src: '/imagenes/imagenes arqui/20220526120642_IMG_7201.JPG',
    caption: 'Escultura en bronce fundido que adorna y refuerza la carpintería colonial.',
  },
  {
    src: '/imagenes/imagenes arqui/20220526120845_IMG_7203.JPG',
    caption: 'Aldaba monumental de bronce con follaje barroco y mascarón de león.',
  },
  {
    src: '/imagenes/imagenes arqui/20220526120857_IMG_7205.JPG',
    caption: 'Tirador y aldabón virreinal flanqueado por rosetones de bronce en el portón.',
  },
  {
    src: '/imagenes/imagenes arqui/20220526120903_IMG_7207.JPG',
    caption: 'Detalle de la argolla y mascarón zoomorfo de la aldaba principal.',
  },
  {
    src: '/imagenes/imagenes arqui/20220526121133_IMG_7211.JPG',
    caption: 'Torre campanario exenta de piedra sillar y calicanto con sus vanos y campanas.',
  },
  {
    src: '/imagenes/imagenes arqui/IMG_20200926_152647868.jpg',
    caption: 'Platería colonial repujada con figura de ángel turiferario y flores en relieve.',
  },
  {
    src: '/imagenes/imagenes arqui/IMG_20200927_102218677.jpg',
    caption: 'Campana mayor virreinal de bronce con vista hacia la plaza de San Jerónimo.',
  },
  {
    src: '/imagenes/imagenes arqui/WhatsApp Image 2025-09-05 at 12.06.19 PM (1).jpeg',
    caption: 'Imagen patronal de San Jerónimo Doctor con capelo cardenalicio, pluma y templo.',
  },
  {
    src: '/imagenes/imagenes arqui/WhatsApp Image 2025-09-05 at 12.06.19 PM (2).jpeg',
    caption: 'San Jerónimo en el presbiterio bajo el Cristo Crucificado con manto bordado en oro.',
  },
  {
    src: '/imagenes/imagenes arqui/WhatsApp Image 2025-09-05 at 12.09.18 PM (1).jpeg',
    caption: 'Aldabón barroco de bronce y clavazón colonial sobre la madera del portón.',
  },
  {
    src: '/imagenes/imagenes arqui/WhatsApp Image 2025-09-05 at 12.09.18 PM (2).jpeg',
    caption: 'Portón principal tachonado enmarcado por las dovelas de piedra sillar de la portada.',
  },
  {
    src: '/imagenes/imagenes arqui/_MG_8461.JPG',
    caption: 'Lienzo colonial de la Pasión de Cristo con marco tallado y dorado en pan de oro.',
  },
]
