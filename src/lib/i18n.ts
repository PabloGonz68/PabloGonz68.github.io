export type Lang = 'es' | 'en'

export const translations = {
  es: {
    // Navbar
    nav: {
      home: 'Inicio',
      skills: 'Tecnologías',
      experience: 'Experiencia',
      education: 'Educación',
      projects: 'Proyectos',
      cybersecurity: 'Ciberseguridad',
      contact: 'Contacto',
      openMenu: 'Abrir menú',
      closeMenu: 'Cerrar menú',
    },

    // Hero
    hero: {
      available: 'Disponible para nuevos proyectos',
      typewriterTexts: [
        'Desarrollador Full Stack',
        'Especialista React & Spring Boot',
        'Apasionado por la Ciberseguridad',
      ],
      description:
        'Técnico superior graduado en DAM y DAW con experiencia en desarrollo web y móvil. Especializado en tecnologías modernas, arquitecturas escalables y ciberseguridad.',
      contactBtn: 'Contactar',
      downloadCV: 'Descargar CV',
      viewProjects: 'Ver Proyectos',
      scroll: 'SCROLL',
    },

    // Skills
    skills: {
      label: '> stack técnico',
      title: 'Tecnologías',
      sub: 'Experiencia en un amplio stack de tecnologías modernas',
    },

    // Projects
    projects: {
      label: '> mi trabajo',
      title: 'Proyectos',
      sub: 'Algunos de mis trabajos más destacados',
      list: [
        {
          title: 'Togethr',
          description: 'Plataforma web Full-Stack para gestión de tareas y planes con autenticación JWT segura. Destaca por su sólida arquitectura cliente-servidor construida con Java Spring Boot y React.',
        },
        {
          title: 'Hospeda',
          description: 'Plataforma de hospedaje entre particulares desarrollada con React, Spring Boot y MySQL.',
        },
        {
          title: 'MixPlace',
          description: 'Aplicación de gestión de tareas con Angular, .NET Core y base de datos SQL Server.',
        },
        {
          title: 'Unitidy',
          description: 'App móvil de gestión de tareas para pisos de estudiantes con Android Studio y SQLite.',
        },
        {
          title: 'Basic Instagram Clone',
          description: 'Clon básico de Instagram desarrollado con Laravel, PHP, Tailwind CSS y MySQL.',
        },
      ],
    },

    // Contact
    contact: {
      label: '> hablemos',
      title: 'Contacto',
      sub: '¿Tienes un proyecto en mente? ¡Hablemos!',
      email: 'Email',
      phone: 'Teléfono',
      location: 'Ubicación',
      locationVal: 'Cádiz, España',
      namePlaceholder: 'Nombre',
      emailPlaceholder: 'Email',
      subjectPlaceholder: 'Asunto',
      messagePlaceholder: 'Mensaje',
      sendBtn: 'Enviar Mensaje',
      sending: 'Enviando...',
      sent: '✓ Mensaje enviado correctamente',
      error: '✗ Error al enviar. Inténtalo de nuevo.',
    },

    // Footer
    footer: {
      rights: '© {year} Pablo González Silva · Astro · React · Framer Motion',
    },

    // Experience
    experience: {
      label: '> trayectoria',
      title: 'Experiencia',
      sub: 'Experiencia práctica en entornos reales de desarrollo profesional',
      clickHint: '· Haz click en cada tarjeta para expandir/contraer ·',
      list: [
        {
          role: 'Desarrollador Full Stack',
          type: 'Prácticas Profesionales',
          company: 'Agencia Adhoc',
          location: 'Cádiz, España',
          period: 'Marzo 2025 — Junio 2025',
          description: [
            'Migración y desarrollo de plataformas web hacia arquitecturas modernas y escalables.',
            'Separación de gestión de contenido y renderizado visual usando WordPress Headless.',
            'Implementación de componentes altamente responsivos con React y Astro.',
            'Programación de lógica de negocio en servidor con PHP.',
          ],
        },
        {
          role: 'Programador Full Stack',
          type: 'Prácticas Profesionales',
          company: 'Hermes Interactiva',
          location: 'Cádiz, España',
          period: 'Abril 2024 — Junio 2024',
          description: [
            'Diseño e implementación desde cero de APIs RESTful escalables.',
            'Integración de protocolos de autenticación y control de acceso seguro con Spring Security.',
            'Optimización y mantenimiento de software de gestión empresarial heredado.',
            'Modelado de datos y administración de esquemas en SQL Server.',
          ],
        },
      ],
    },

    // Education
    education: {
      label: '> formación',
      title: 'Educación',
      sub: 'Formación académica oficial y certificaciones en tecnologías modernas',
      academic: 'Formación Académica',
      certs: 'Certificaciones',
      continuousLearning: '+ Aprendizaje continuo en curso',
      current: 'Actualmente',
      official: 'Formación Oficial',
      list: [
        {
          degree: 'Curso de Especialización en Ciberseguridad',
          description:
            'Especialización en análisis de vulnerabilidades, hacking ético, criptografía y defensa de sistemas y redes.',
        },
        {
          degree: 'Grado Superior en Desarrollo de Aplicaciones Web (DAW)',
          description:
            'Especialización en tecnologías web modernas: HTML, CSS, JavaScript, frameworks frontend, backend con PHP y despliegue de aplicaciones.',
        },
        {
          degree: 'Grado Superior en Desarrollo de Aplicaciones Multiplataforma (DAM)',
          description:
            'Formación en desarrollo de aplicaciones de escritorio, móviles y servicios web. Programación orientada a objetos con Java y gestión de bases de datos.',
        },
      ],
      certList: [
        {
          title: 'Desarrollo de Servicios Web REST en Java con Spring Boot',
          date: 'Marzo 2024',
        },
        {
          title: 'Spring Boot: De cero a experto',
          date: 'Enero 2024',
        },
      ],
    },

    // Cybersecurity
    cyber: {
      label: '> especialización',
      title: 'Ciberseguridad',
      sub: 'Curso de especialización · Stack completo de herramientas ofensivas, defensivas y forenses',
      writeups: 'Click para acceder a mis write-ups',
      activityLabel: '> actividad docente',
      workshops: 'Talleres &',
      talks: 'Ponencias',
      statsTools: 'Herramientas',
      statsCategories: 'Categorías',
      categories: [
        { label: 'Blue Team & Infraestructura' },
        { label: 'Red Team & Auditoría' },
        { label: 'Seguridad Web & DevSecOps' },
        { label: 'Análisis Forense' },
      ],
      workshopList: [
        {
          badge: 'Ponencia',
          title: 'El lado invisible de internet',
          subtitle: 'Red TOR, anonimato y rastros digitales',
          venue: 'IES Sotero Hernández · Sevilla',
          description:
            'Programa de concienciación en ciberseguridad dirigido a alumnos de la ESO y familias de todo el centro. Análisis de la red TOR, el anonimato en internet y la huella digital.',
          context: 'Plan de formación en ciberseguridad',
        },
        {
          badge: 'Concienciación',
          title: 'Programa de concienciación',
          subtitle: 'en ciberseguridad',
          venue: 'IES Rafael Alberti · Cádiz',
          description:
            'Diseño e impartición de sesiones de concienciación sobre ciberseguridad para alumnos, profesores y familias del instituto.',
          context: 'Plan de formación en ciberseguridad',
        },
        {
          badge: 'CTF',
          title: 'CTF IES Rafael Alberti 2025/2026',
          subtitle: 'Diseño y creación de retos',
          venue: 'IES Rafael Alberti · Cádiz',
          description:
            'Diseño y creación de retos de Capture The Flag para el CTF organizado por el IES Rafael Alberti. Retos de forense, criptografía, web y OSINT.',
          context: 'Organizado por IES Rafael Alberti',
        },
      ],
      ctfDates: [
        { label: 'Fase Online', date: '20 – 22 Mar 2026' },
        { label: 'Final Presencial', date: '26 Mar 2026' },
      ],
    },
  },

  en: {
    // Navbar
    nav: {
      home: 'Home',
      skills: 'Technologies',
      experience: 'Experience',
      education: 'Education',
      projects: 'Projects',
      cybersecurity: 'Cybersecurity',
      contact: 'Contact',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
    },

    // Hero
    hero: {
      available: 'Available for new projects',
      typewriterTexts: [
        'Full Stack Developer',
        'React & Spring Boot Specialist',
        'Passionate about Cybersecurity',
      ],
      description:
        'Higher technician graduated in DAM and DAW with experience in web and mobile development. Specialized in modern technologies, scalable architectures and cybersecurity.',
      contactBtn: 'Contact me',
      downloadCV: 'Download CV',
      viewProjects: 'View Projects',
      scroll: 'SCROLL',
    },

    // Skills
    skills: {
      label: '> tech stack',
      title: 'Technologies',
      sub: 'Experience with a wide stack of modern technologies',
    },

    // Projects
    projects: {
      label: '> my work',
      title: 'Projects',
      sub: 'Some of my most notable works',
      list: [
        {
          title: 'Togethr',
          description: 'Full-Stack web platform for task and plan management with secure JWT authentication. Features a robust client-server architecture built with Java Spring Boot and React.',
        },
        {
          title: 'Hospeda',
          description: 'Peer-to-peer lodging platform built with React, Spring Boot and MySQL.',
        },
        {
          title: 'MixPlace',
          description: 'Task management application built with Angular, .NET Core and SQL Server.',
        },
        {
          title: 'Unitidy',
          description: 'Mobile task management app for student flats built with Android Studio and SQLite.',
        },
        {
          title: 'Basic Instagram Clone',
          description: 'Basic Instagram clone built with Laravel, PHP, Tailwind CSS and MySQL.',
        },
      ],
    },

    // Contact
    contact: {
      label: "> let's talk",
      title: 'Contact',
      sub: 'Have a project in mind? Let\'s talk!',
      email: 'Email',
      phone: 'Phone',
      location: 'Location',
      locationVal: 'Cádiz, Spain',
      namePlaceholder: 'Name',
      emailPlaceholder: 'Email',
      subjectPlaceholder: 'Subject',
      messagePlaceholder: 'Message',
      sendBtn: 'Send Message',
      sending: 'Sending...',
      sent: '✓ Message sent successfully',
      error: '✗ Failed to send. Please try again.',
    },

    // Footer
    footer: {
      rights: '© {year} Pablo González Silva · Astro · React · Framer Motion',
    },

    // Experience
    experience: {
      label: '> career',
      title: 'Experience',
      sub: 'Hands-on experience in real professional development environments',
      clickHint: '· Click each card to expand/collapse ·',
      list: [
        {
          role: 'Full Stack Developer',
          type: 'Professional Internship',
          company: 'Agencia Adhoc',
          location: 'Cádiz, Spain',
          period: 'March 2025 — June 2025',
          description: [
            'Migration and development of web platforms towards modern and scalable architectures.',
            'Separation of content management and visual rendering using Headless WordPress.',
            'Implementation of highly responsive components with React and Astro.',
            'Server-side business logic programming with PHP.',
          ],
        },
        {
          role: 'Full Stack Programmer',
          type: 'Professional Internship',
          company: 'Hermes Interactiva',
          location: 'Cádiz, Spain',
          period: 'April 2024 — June 2024',
          description: [
            'Design and implementation from scratch of scalable RESTful APIs.',
            'Integration of authentication protocols and secure access control with Spring Security.',
            'Optimization and maintenance of legacy enterprise management software.',
            'Data modeling and schema administration in SQL Server.',
          ],
        },
      ],
    },

    // Education
    education: {
      label: '> training',
      title: 'Education',
      sub: 'Official academic training and certifications in modern technologies',
      academic: 'Academic Background',
      certs: 'Certifications',
      continuousLearning: '+ Continuous learning in progress',
      current: 'Currently',
      official: 'Official Training',
      list: [
        {
          degree: 'Cybersecurity Specialization Course',
          description:
            'Specialization in vulnerability analysis, ethical hacking, cryptography and defense of systems and networks.',
        },
        {
          degree: 'Higher Degree in Web Application Development (DAW)',
          description:
            'Specialization in modern web technologies: HTML, CSS, JavaScript, frontend frameworks, backend with PHP and application deployment.',
        },
        {
          degree: 'Higher Degree in Multiplatform Application Development (DAM)',
          description:
            'Training in desktop, mobile and web services application development. Object-oriented programming with Java and database management.',
        },
      ],
      certList: [
        {
          title: 'REST Web Services Development in Java with Spring Boot',
          date: 'March 2024',
        },
        {
          title: 'Spring Boot: From Zero to Expert',
          date: 'January 2024',
        },
      ],
    },

    // Cybersecurity
    cyber: {
      label: '> specialization',
      title: 'Cybersecurity',
      sub: 'Specialization course · Complete stack of offensive, defensive and forensic tools',
      writeups: 'Click to access my write-ups',
      activityLabel: '> teaching activity',
      workshops: 'Workshops &',
      talks: 'Talks',
      statsTools: 'Tools',
      statsCategories: 'Categories',
      categories: [
        { label: 'Blue Team & Infrastructure' },
        { label: 'Red Team & Auditing' },
        { label: 'Web Security & DevSecOps' },
        { label: 'Forensic Analysis' },
      ],
      workshopList: [
        {
          badge: 'Talk',
          title: 'The invisible side of the internet',
          subtitle: 'TOR network, anonymity and digital traces',
          venue: 'IES Sotero Hernández · Seville',
          description:
            'Cybersecurity awareness program aimed at secondary school students and families. Analysis of the TOR network, internet anonymity and digital footprint.',
          context: 'Cybersecurity training plan',
        },
        {
          badge: 'Awareness',
          title: 'Awareness program',
          subtitle: 'on cybersecurity',
          venue: 'IES Rafael Alberti · Cádiz',
          description:
            'Design and delivery of cybersecurity awareness sessions for students, teachers and families of the school.',
          context: 'Cybersecurity training plan',
        },
        {
          badge: 'CTF',
          title: 'CTF IES Rafael Alberti 2025/2026',
          subtitle: 'Challenge design and creation',
          venue: 'IES Rafael Alberti · Cádiz',
          description:
            'Design and creation of Capture The Flag challenges for the CTF organized by IES Rafael Alberti. Forensics, cryptography, web and OSINT challenges.',
          context: 'Organized by IES Rafael Alberti',
        },
      ],
      ctfDates: [
        { label: 'Online Phase', date: '20 – 22 Mar 2026' },
        { label: 'In-Person Final', date: '26 Mar 2026' },
      ],
    },
  },
} as const

export type Translations = typeof translations['es']
