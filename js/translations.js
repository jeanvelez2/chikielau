/* ============================================
   Language Translation System
   Supports English and Spanish
   ============================================ */

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.blog': 'Blog',
    'nav.about': 'About',
    'nav.shop': 'Shop',
    'nav.contact': 'Contact',
    
    // Hero Section
    'hero.title': 'Where Books Meet the Stars',
    'hero.tagline': 'A celestial journey through contemporary fiction, fantasy, and literary adventures',
    'hero.intro': 'Welcome to my cosmic corner of the literary universe. Here, I share bold book reviews, honest ratings, and curated recommendations that shine as bright as the stars above. Join me as we explore stories that transcend the ordinary and reach for the extraordinary.',
    'hero.btn.reviews': 'Explore Reviews',
    'hero.btn.shop': 'Book Recommendations',
    
    // Featured Posts Section
    'featured.title': 'Latest Reviews',
    'featured.subtitle': 'Discover my most recent literary adventures',
    'featured.btn.readmore': 'Read Full Review',
    'featured.btn.readreview': 'Read Review',
    'featured.btn.viewall': 'View All Reviews',
    'featured.category.fiction': 'Fiction',
    'featured.category.fantasy': 'Fantasy',
    'featured.category.historical': 'Historical Fiction',
    'featured.category.scifi': 'Science Fiction',
    'featured.post1.title': 'The Midnight Library: A Journey Through Infinite Possibilities',
    'featured.post1.date': 'January 15, 2026',
    'featured.post1.excerpt': 'A profound exploration of regret, choice, and the infinite paths our lives could take. Matt Haig crafts a story that resonates deeply with anyone who\'s ever wondered "what if?"',
    'featured.post2.title': 'Fourth Wing: Dragons, Romance, and Deadly Academia',
    'featured.post2.date': 'January 10, 2026',
    'featured.post2.excerpt': 'Rebecca Yarros delivers an addictive blend of dragon riders, forbidden romance, and high-stakes competition.',
    'featured.post3.title': 'The Seven Husbands of Evelyn Hugo',
    'featured.post3.date': 'January 5, 2026',
    'featured.post3.excerpt': 'A captivating tale of Old Hollywood glamour, secrets, and the price of fame.',
    'featured.post4.title': 'Project Hail Mary: Science Meets Heart',
    'featured.post4.date': 'December 28, 2025',
    'featured.post4.excerpt': 'Andy Weir\'s latest is a thrilling space adventure with humor and heart.',
    
    // Instagram Section
    'instagram.title': 'Follow My Reading Journey',
    'instagram.subtitle': 'Join me on Instagram for daily book content, aesthetic photos, and behind-the-scenes moments',
    'instagram.btn.follow': 'Follow on Instagram',
    
    // Footer
    'footer.newsletter.title': 'Join My Book Club',
    'footer.newsletter.text': 'Get weekly book recommendations and exclusive content delivered to your inbox!',
    'footer.newsletter.placeholder': 'Your email address',
    'footer.newsletter.btn': 'Subscribe',
    'footer.social.title': 'Follow Me',
    'footer.copyright': '© 2026 Chikielau. All rights reserved.',
    
    // Modal
    'modal.title': 'Join the Book Club',
    'modal.description': 'Get weekly book recommendations and exclusive content delivered straight to your inbox!',
    'modal.btn.subscribe': 'Subscribe',
    
    // Form Messages
    'form.error.required': 'This field is required',
    'form.error.email': 'Please enter a valid email address',
    'form.success': 'Thank you! Your message has been sent successfully.',
    'form.sending': 'Sending...',
    'form.error.server': 'Sorry, there was an error sending your message. Please try again.',
    'form.error.network': 'Network error. Please check your connection and try again.',
    
    // Coming Soon
    'comingsoon.title': 'Coming Soon',
    'comingsoon.blog': 'Book reviews and cosmic literary adventures are on their way. Stay tuned for honest ratings and thoughtful recommendations.',
    'comingsoon.shop': 'Curated book merchandise and exclusive recommendations are launching soon. Check back for cosmic treasures.',
    
    // About Page
    'about.hero.title': 'Hello, I\'m Chikielau',
    'about.hero.intro': 'Welcome to my celestial corner of the internet where darkness meets golden light. I\'m a passionate book lover, reviewer, and your guide through the magical world of literature.',
    'about.hero.tagline': 'Let\'s explore the universe one page at a time ✨',
    'about.story.title': 'My Story',
    'about.story.p1': 'My love affair with books began in childhood, curled up in my grandmother\'s library surrounded by the scent of old paper and the whisper of turning pages. That magical space, with its towering shelves and golden afternoon light, became my sanctuary—a place where I could travel to distant worlds, meet unforgettable characters, and discover truths about myself.',
    'about.story.p2': 'Years later, I created Chikielau as a way to share that same magic with fellow book lovers. The name itself is a reflection of my journey—a blend of whimsy and wonder, much like the stories I cherish most. Here, I combine my passion for literature with my love of celestial aesthetics, creating a space that feels both timeless and enchanting.',
    'about.story.p3': 'What started as a personal reading journal has blossomed into a community of kindred spirits who believe that books have the power to transform us. Through honest reviews, thoughtful recommendations, and genuine conversations about the stories that move us, I hope to help you discover your next favorite book.',
    'about.story.p4': 'When I\'m not reading (which is rare!), you\'ll find me sipping tea in cozy cafes, hunting for vintage bookmarks at antique shops, or photographing beautiful book covers for my Instagram. I believe that reading is not just a hobby—it\'s a way of life, a form of self-care, and a bridge that connects us all.',
    'about.stats.title': 'By the Numbers',
    'about.stats.books': 'Books Read This Year',
    'about.stats.rating': 'Average Rating',
    'about.stats.genres': 'Favorite Genres',
    'about.stats.tbr': 'Books on TBR',
    'about.genres.title': 'Favorite Genres',
    'about.genres.subtitle': 'While I\'ll read just about anything with a compelling story, these are the genres that truly make my heart sing:',
    'about.genre.literary': 'Literary Fiction',
    'about.genre.literary.text': 'Beautiful prose, complex characters, and stories that linger in your mind long after the final page. I\'m drawn to books that explore the human condition with depth and nuance.',
    'about.genre.fantasy': 'Fantasy & Mythology',
    'about.genre.fantasy.text': 'From epic high fantasy to intimate retellings of ancient myths, I love stories that transport me to magical realms and reimagine timeless tales with fresh perspectives.',
    'about.genre.historical': 'Historical Fiction',
    'about.genre.historical.text': 'There\'s something magical about stepping into another era through the pages of a book. I especially love stories that shine a light on overlooked voices from history.',
    'about.genre.romance': 'Contemporary Romance',
    'about.genre.romance.text': 'Give me all the swoon-worthy moments, witty banter, and heartfelt connections. I believe in the power of love stories that feel authentic and emotionally resonant.',
    'about.genre.magical': 'Magical Realism',
    'about.genre.magical.text': 'The perfect blend of the ordinary and the extraordinary. I\'m captivated by stories where magic weaves seamlessly into everyday life, creating something truly enchanting.',
    'about.genre.memoir': 'Memoir & Essays',
    'about.genre.memoir.text': 'Real stories from real people have a unique power to inspire and connect us. I\'m always seeking memoirs that offer fresh perspectives and beautifully crafted personal essays.',
    'about.touches.title': 'A Few of My Favorite Things',
    'about.touch.spot': '📚 Reading Spot',
    'about.touch.spot.text': 'A velvet armchair by the window with a soft throw blanket, a cup of Earl Grey tea, and natural light streaming in. Bonus points if it\'s raining outside.',
    'about.touch.time': '🌙 Reading Time',
    'about.touch.time.text': 'Late evenings when the world is quiet, or lazy Sunday mornings when I can lose myself in a story for hours without interruption.',
    'about.touch.aesthetic': '✨ Book Aesthetic',
    'about.touch.aesthetic.text': 'Vintage hardcovers with gilded edges, celestial cover designs, and that perfect combination of beautiful typography and atmospheric illustrations.',
    'about.touch.pairing': '☕ Perfect Pairing',
    'about.touch.pairing.text': 'A good book deserves a good beverage. I\'m a tea enthusiast with a collection of over 30 varieties, each carefully matched to different reading moods.',
    'about.touch.soundtrack': '🎵 Reading Soundtrack',
    'about.touch.soundtrack.text': 'Instrumental music, lo-fi beats, or complete silence depending on the book. For fantasy epics, I love cinematic soundtracks that enhance the atmosphere.',
    'about.touch.community': '💫 Book Community',
    'about.touch.community.text': 'Connecting with fellow readers is one of my greatest joys. I love discussing plot twists, sharing recommendations, and celebrating our mutual love of stories.',
    'about.cta.title': 'Let\'s Connect',
    'about.cta.text': 'I\'d love to hear from you! Whether you want to discuss your latest read, share a book recommendation, or just chat about all things literary, I\'m always excited to connect with fellow book lovers.',
    'about.cta.btn.contact': 'Get in Touch',
    'about.cta.btn.reviews': 'Read My Reviews',
    'about.cta.social': 'Follow my reading journey on social media:',
    
    // Contact Page
    'contact.hero.title': 'Let\'s Connect',
    'contact.hero.intro': 'I\'d love to hear from you! Whether you want to discuss your latest read, share a book recommendation, ask about collaborations, or just chat about all things literary, feel free to reach out. I read every message and do my best to respond within 48 hours.',
    'contact.reason.recommendations': 'Book Recommendations',
    'contact.reason.collaboration': 'Collaboration Inquiries',
    'contact.reason.questions': 'General Questions',
    'contact.reason.reviews': 'Review Requests',
    'contact.form.title': 'Send Me a Message',
    'contact.form.subtitle': 'Fill out the form below and I\'ll get back to you as soon as possible. All fields marked with an asterisk (*) are required.',
    'contact.form.name': 'Name',
    'contact.form.email': 'Email',
    'contact.form.message': 'Message',
    'contact.form.name.placeholder': 'Your name',
    'contact.form.email.placeholder': 'your.email@example.com',
    'contact.form.message.placeholder': 'Tell me what\'s on your mind...',
    'contact.form.btn': 'Send Message',
    'contact.info.title': 'Other Ways to Connect',
    'contact.info.text': 'Prefer social media? You can also find me on these platforms where I share daily bookish content, reading updates, and connect with the book community.',
    'contact.response.title': 'Response Time',
    'contact.response.text': 'I typically respond to messages within 48 hours. If you don\'t hear back from me within that timeframe, please check your spam folder or try reaching out via social media.',
    'contact.collab.title': 'Collaboration Guidelines',
    'contact.collab.text': 'I\'m always open to collaborating with authors, publishers, and fellow book lovers. Please include details about your project or proposal in your message, and I\'ll get back to you with my availability and rates.',
    'contact.faq.title': 'Frequently Asked Questions',
    'contact.faq.q1': 'Do you accept review copies?',
    'contact.faq.a1': 'Yes! I\'m always interested in discovering new books. Please reach out with details about the book, publication date, and any specific requirements. I prioritize books that align with my favorite genres and reading interests.',
    'contact.faq.q2': 'How long does it take to review a book?',
    'contact.faq.a2': 'Typically 2-4 weeks from the time I receive the book, depending on my current reading schedule and the book\'s length. I\'ll provide a more specific timeline when we discuss the review.',
    'contact.faq.q3': 'Can I guest post on your blog?',
    'contact.faq.a3': 'I occasionally feature guest posts from fellow book lovers and authors. Send me your pitch with a brief outline of your proposed topic, and I\'ll let you know if it\'s a good fit for my audience.',
    'contact.faq.q4': 'Do you offer book coaching or editing services?',
    'contact.faq.a4': 'While I focus primarily on reviewing and recommending books, I\'m happy to discuss potential collaborations. Reach out with details about what you\'re looking for, and we can explore possibilities.',
    
    // Accessibility
    'aria.rating': 'Rating: {rating} out of 5 stars',
    'aria.toggle.nav': 'Toggle navigation menu',
    'aria.close.modal': 'Close newsletter signup modal',
    'aria.follow.instagram': 'Follow Chikielau on Instagram',
    'aria.follow.tiktok': 'Follow Chikielau on TikTok',
    'aria.follow.goodreads': 'Follow Chikielau on Goodreads'
  },
  
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.blog': 'Blog',
    'nav.about': 'Acerca de',
    'nav.shop': 'Tienda',
    'nav.contact': 'Contacto',
    
    // Hero Section
    'hero.title': 'Donde los Libros Encuentran las Estrellas',
    'hero.tagline': 'Un viaje celestial a través de la ficción contemporánea, fantasía y aventuras literarias',
    'hero.intro': 'Bienvenido a mi rincón cósmico del universo literario. Aquí comparto reseñas audaces de libros, calificaciones honestas y recomendaciones curadas que brillan tan intensamente como las estrellas. Únete a mí mientras exploramos historias que trascienden lo ordinario y alcanzan lo extraordinario.',
    'hero.btn.reviews': 'Explorar Reseñas',
    'hero.btn.shop': 'Recomendaciones de Libros',
    
    // Featured Posts Section
    'featured.title': 'Últimas Reseñas',
    'featured.subtitle': 'Descubre mis aventuras literarias más recientes',
    'featured.btn.readmore': 'Leer Reseña Completa',
    'featured.btn.readreview': 'Leer Reseña',
    'featured.btn.viewall': 'Ver Todas las Reseñas',
    'featured.category.fiction': 'Ficción',
    'featured.category.fantasy': 'Fantasía',
    'featured.category.historical': 'Ficción Histórica',
    'featured.category.scifi': 'Ciencia Ficción',
    'featured.post1.title': 'La Biblioteca de la Medianoche: Un Viaje a Través de Infinitas Posibilidades',
    'featured.post1.date': '15 de enero de 2026',
    'featured.post1.excerpt': 'Una exploración profunda del arrepentimiento, la elección y los infinitos caminos que nuestras vidas podrían tomar. Matt Haig crea una historia que resuena profundamente con cualquiera que alguna vez se haya preguntado "¿y si?"',
    'featured.post2.title': 'Fourth Wing: Dragones, Romance y Academia Mortal',
    'featured.post2.date': '10 de enero de 2026',
    'featured.post2.excerpt': 'Rebecca Yarros ofrece una mezcla adictiva de jinetes de dragones, romance prohibido y competencia de alto riesgo.',
    'featured.post3.title': 'Los Siete Maridos de Evelyn Hugo',
    'featured.post3.date': '5 de enero de 2026',
    'featured.post3.excerpt': 'Una historia cautivadora del glamour del viejo Hollywood, secretos y el precio de la fama.',
    'featured.post4.title': 'Proyecto Hail Mary: La Ciencia Encuentra el Corazón',
    'featured.post4.date': '28 de diciembre de 2025',
    'featured.post4.excerpt': 'Lo último de Andy Weir es una emocionante aventura espacial con humor y corazón.',
    
    // Instagram Section
    'instagram.title': 'Sigue Mi Viaje de Lectura',
    'instagram.subtitle': 'Únete a mí en Instagram para contenido diario de libros, fotos estéticas y momentos detrás de escena',
    'instagram.btn.follow': 'Seguir en Instagram',
    
    // Footer
    'footer.newsletter.title': 'Únete a Mi Club de Lectura',
    'footer.newsletter.text': '¡Recibe recomendaciones semanales de libros y contenido exclusivo en tu bandeja de entrada!',
    'footer.newsletter.placeholder': 'Tu dirección de correo',
    'footer.newsletter.btn': 'Suscribirse',
    'footer.social.title': 'Sígueme',
    'footer.copyright': '© 2026 Chikielau. Todos los derechos reservados.',
    
    // Modal
    'modal.title': 'Únete al Club de Lectura',
    'modal.description': '¡Recibe recomendaciones semanales de libros y contenido exclusivo directamente en tu bandeja de entrada!',
    'modal.btn.subscribe': 'Suscribirse',
    
    // Form Messages
    'form.error.required': 'Este campo es obligatorio',
    'form.error.email': 'Por favor ingresa una dirección de correo válida',
    'form.success': '¡Gracias! Tu mensaje ha sido enviado exitosamente.',
    'form.sending': 'Enviando...',
    'form.error.server': 'Lo sentimos, hubo un error al enviar tu mensaje. Por favor intenta de nuevo.',
    'form.error.network': 'Error de red. Por favor verifica tu conexión e intenta de nuevo.',
    
    // Coming Soon
    'comingsoon.title': 'Próximamente',
    'comingsoon.blog': 'Las reseñas de libros y aventuras literarias cósmicas están en camino. Mantente atento para calificaciones honestas y recomendaciones reflexivas.',
    'comingsoon.shop': 'Mercancía de libros curada y recomendaciones exclusivas se lanzarán pronto. Vuelve para tesoros cósmicos.',
    
    // About Page
    'about.hero.title': 'Hola, soy Chikielau',
    'about.hero.intro': 'Bienvenido a mi rincón celestial de internet donde la oscuridad se encuentra con la luz dorada. Soy una apasionada amante de los libros, crítica y tu guía a través del mundo mágico de la literatura.',
    'about.hero.tagline': 'Exploremos el universo una página a la vez ✨',
    'about.story.title': 'Mi Historia',
    'about.story.p1': 'Mi historia de amor con los libros comenzó en la infancia, acurrucada en la biblioteca de mi abuela rodeada del aroma del papel viejo y el susurro de las páginas al pasar. Ese espacio mágico, con sus estantes imponentes y la luz dorada de la tarde, se convirtió en mi santuario—un lugar donde podía viajar a mundos distantes, conocer personajes inolvidables y descubrir verdades sobre mí misma.',
    'about.story.p2': 'Años después, creé Chikielau como una forma de compartir esa misma magia con otros amantes de los libros. El nombre en sí es un reflejo de mi viaje—una mezcla de fantasía y asombro, muy parecido a las historias que más aprecio. Aquí combino mi pasión por la literatura con mi amor por la estética celestial, creando un espacio que se siente atemporal y encantador.',
    'about.story.p3': 'Lo que comenzó como un diario de lectura personal ha florecido en una comunidad de almas afines que creen que los libros tienen el poder de transformarnos. A través de reseñas honestas, recomendaciones reflexivas y conversaciones genuinas sobre las historias que nos conmueven, espero ayudarte a descubrir tu próximo libro favorito.',
    'about.story.p4': 'Cuando no estoy leyendo (¡lo cual es raro!), me encontrarás tomando té en cafés acogedores, buscando marcadores vintage en tiendas de antigüedades o fotografiando hermosas portadas de libros para mi Instagram. Creo que leer no es solo un pasatiempo—es una forma de vida, una forma de autocuidado y un puente que nos conecta a todos.',
    'about.stats.title': 'En Números',
    'about.stats.books': 'Libros Leídos Este Año',
    'about.stats.rating': 'Calificación Promedio',
    'about.stats.genres': 'Géneros Favoritos',
    'about.stats.tbr': 'Libros por Leer',
    'about.genres.title': 'Géneros Favoritos',
    'about.genres.subtitle': 'Aunque leo casi cualquier cosa con una historia convincente, estos son los géneros que realmente hacen cantar mi corazón:',
    'about.genre.literary': 'Ficción Literaria',
    'about.genre.literary.text': 'Prosa hermosa, personajes complejos e historias que permanecen en tu mente mucho después de la página final. Me atraen los libros que exploran la condición humana con profundidad y matices.',
    'about.genre.fantasy': 'Fantasía y Mitología',
    'about.genre.fantasy.text': 'Desde la alta fantasía épica hasta reinterpretaciones íntimas de mitos antiguos, amo las historias que me transportan a reinos mágicos y reimaginan cuentos atemporales con perspectivas frescas.',
    'about.genre.historical': 'Ficción Histórica',
    'about.genre.historical.text': 'Hay algo mágico en adentrarse en otra época a través de las páginas de un libro. Especialmente amo las historias que iluminan voces pasadas por alto de la historia.',
    'about.genre.romance': 'Romance Contemporáneo',
    'about.genre.romance.text': 'Dame todos los momentos que hacen suspirar, el ingenio y las conexiones sinceras. Creo en el poder de las historias de amor que se sienten auténticas y emocionalmente resonantes.',
    'about.genre.magical': 'Realismo Mágico',
    'about.genre.magical.text': 'La mezcla perfecta de lo ordinario y lo extraordinario. Me cautivan las historias donde la magia se entrelaza sin problemas en la vida cotidiana, creando algo verdaderamente encantador.',
    'about.genre.memoir': 'Memorias y Ensayos',
    'about.genre.memoir.text': 'Las historias reales de personas reales tienen un poder único para inspirar y conectarnos. Siempre busco memorias que ofrezcan perspectivas frescas y ensayos personales bellamente elaborados.',
    'about.touches.title': 'Algunas de Mis Cosas Favoritas',
    'about.touch.spot': '📚 Lugar de Lectura',
    'about.touch.spot.text': 'Un sillón de terciopelo junto a la ventana con una manta suave, una taza de té Earl Grey y luz natural entrando. Puntos extra si está lloviendo afuera.',
    'about.touch.time': '🌙 Hora de Lectura',
    'about.touch.time.text': 'Noches tardías cuando el mundo está tranquilo, o mañanas perezosas de domingo cuando puedo perderme en una historia durante horas sin interrupción.',
    'about.touch.aesthetic': '✨ Estética de Libros',
    'about.touch.aesthetic.text': 'Libros de tapa dura vintage con bordes dorados, diseños de portada celestiales y esa combinación perfecta de tipografía hermosa e ilustraciones atmosféricas.',
    'about.touch.pairing': '☕ Maridaje Perfecto',
    'about.touch.pairing.text': 'Un buen libro merece una buena bebida. Soy una entusiasta del té con una colección de más de 30 variedades, cada una cuidadosamente combinada con diferentes estados de ánimo de lectura.',
    'about.touch.soundtrack': '🎵 Banda Sonora de Lectura',
    'about.touch.soundtrack.text': 'Música instrumental, ritmos lo-fi o silencio completo dependiendo del libro. Para épicas de fantasía, amo las bandas sonoras cinematográficas que realzan la atmósfera.',
    'about.touch.community': '💫 Comunidad de Libros',
    'about.touch.community.text': 'Conectar con otros lectores es una de mis mayores alegrías. Me encanta discutir giros de trama, compartir recomendaciones y celebrar nuestro amor mutuo por las historias.',
    'about.cta.title': 'Conectemos',
    'about.cta.text': '¡Me encantaría saber de ti! Ya sea que quieras discutir tu última lectura, compartir una recomendación de libro o simplemente charlar sobre todo lo literario, siempre estoy emocionada de conectar con otros amantes de los libros.',
    'about.cta.btn.contact': 'Ponte en Contacto',
    'about.cta.btn.reviews': 'Lee Mis Reseñas',
    'about.cta.social': 'Sigue mi viaje de lectura en redes sociales:',
    
    // Contact Page
    'contact.hero.title': 'Conectemos',
    'contact.hero.intro': '¡Me encantaría saber de ti! Ya sea que quieras discutir tu última lectura, compartir una recomendación de libro, preguntar sobre colaboraciones o simplemente charlar sobre todo lo literario, no dudes en contactarme. Leo cada mensaje y hago mi mejor esfuerzo para responder dentro de 48 horas.',
    'contact.reason.recommendations': 'Recomendaciones de Libros',
    'contact.reason.collaboration': 'Consultas de Colaboración',
    'contact.reason.questions': 'Preguntas Generales',
    'contact.reason.reviews': 'Solicitudes de Reseñas',
    'contact.form.title': 'Envíame un Mensaje',
    'contact.form.subtitle': 'Completa el formulario a continuación y te responderé lo antes posible. Todos los campos marcados con asterisco (*) son obligatorios.',
    'contact.form.name': 'Nombre',
    'contact.form.email': 'Correo Electrónico',
    'contact.form.message': 'Mensaje',
    'contact.form.name.placeholder': 'Tu nombre',
    'contact.form.email.placeholder': 'tu.correo@ejemplo.com',
    'contact.form.message.placeholder': 'Cuéntame qué tienes en mente...',
    'contact.form.btn': 'Enviar Mensaje',
    'contact.info.title': 'Otras Formas de Conectar',
    'contact.info.text': '¿Prefieres las redes sociales? También puedes encontrarme en estas plataformas donde comparto contenido diario sobre libros, actualizaciones de lectura y conecto con la comunidad de lectores.',
    'contact.response.title': 'Tiempo de Respuesta',
    'contact.response.text': 'Normalmente respondo a los mensajes dentro de 48 horas. Si no recibes respuesta en ese plazo, por favor revisa tu carpeta de spam o intenta contactarme a través de redes sociales.',
    'contact.collab.title': 'Pautas de Colaboración',
    'contact.collab.text': 'Siempre estoy abierta a colaborar con autores, editoriales y otros amantes de los libros. Por favor incluye detalles sobre tu proyecto o propuesta en tu mensaje, y te responderé con mi disponibilidad y tarifas.',
    'contact.faq.title': 'Preguntas Frecuentes',
    'contact.faq.q1': '¿Aceptas copias de reseña?',
    'contact.faq.a1': '¡Sí! Siempre estoy interesada en descubrir nuevos libros. Por favor contáctame con detalles sobre el libro, fecha de publicación y cualquier requisito específico. Priorizo libros que se alineen con mis géneros favoritos e intereses de lectura.',
    'contact.faq.q2': '¿Cuánto tiempo toma reseñar un libro?',
    'contact.faq.a2': 'Típicamente de 2 a 4 semanas desde que recibo el libro, dependiendo de mi calendario de lectura actual y la extensión del libro. Proporcionaré un cronograma más específico cuando discutamos la reseña.',
    'contact.faq.q3': '¿Puedo publicar como invitado en tu blog?',
    'contact.faq.a3': 'Ocasionalmente presento publicaciones de invitados de otros amantes de los libros y autores. Envíame tu propuesta con un breve resumen de tu tema propuesto, y te haré saber si es adecuado para mi audiencia.',
    'contact.faq.q4': '¿Ofreces servicios de coaching o edición de libros?',
    'contact.faq.a4': 'Aunque me enfoco principalmente en reseñar y recomendar libros, estoy feliz de discutir posibles colaboraciones. Contáctame con detalles sobre lo que buscas, y podemos explorar posibilidades.',
    
    // Accessibility
    'aria.rating': 'Calificación: {rating} de 5 estrellas',
    'aria.toggle.nav': 'Alternar menú de navegación',
    'aria.close.modal': 'Cerrar modal de suscripción al boletín',
    'aria.follow.instagram': 'Seguir a Chikielau en Instagram',
    'aria.follow.tiktok': 'Seguir a Chikielau en TikTok',
    'aria.follow.goodreads': 'Seguir a Chikielau en Goodreads'
  }
};

// Language Manager
class LanguageManager {
  constructor() {
    this.currentLang = this.getStoredLanguage() || 'en';
    this.init();
  }
  
  init() {
    this.updatePageLanguage();
    this.attachEventListeners();
  }
  
  getStoredLanguage() {
    try {
      return localStorage.getItem('preferred_language');
    } catch (e) {
      return null;
    }
  }
  
  setStoredLanguage(lang) {
    try {
      localStorage.setItem('preferred_language', lang);
    } catch (e) {
      console.warn('localStorage not available:', e);
    }
  }
  
  switchLanguage(lang) {
    if (lang !== 'en' && lang !== 'es') return;
    
    this.currentLang = lang;
    this.setStoredLanguage(lang);
    this.updatePageLanguage();
    
    // Update HTML lang attribute
    document.documentElement.setAttribute('lang', lang);
  }
  
  translate(key, params = {}) {
    let text = translations[this.currentLang][key] || translations.en[key] || key;
    
    // Replace parameters in translation
    Object.keys(params).forEach(param => {
      text = text.replace(`{${param}}`, params[param]);
    });
    
    return text;
  }
  
  updatePageLanguage() {
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const params = element.getAttribute('data-i18n-params');
      const parsedParams = params ? JSON.parse(params) : {};
      
      element.textContent = this.translate(key, parsedParams);
    });
    
    // Update all elements with data-i18n-placeholder attribute
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      element.setAttribute('placeholder', this.translate(key));
    });
    
    // Update all elements with data-i18n-aria attribute
    document.querySelectorAll('[data-i18n-aria]').forEach(element => {
      const key = element.getAttribute('data-i18n-aria');
      const attr = element.getAttribute('data-i18n-aria-attr') || 'aria-label';
      const params = element.getAttribute('data-i18n-params');
      const parsedParams = params ? JSON.parse(params) : {};
      
      element.setAttribute(attr, this.translate(key, parsedParams));
    });
    
    // Update language toggle buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
      if (btn.getAttribute('data-lang') === this.currentLang) {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      }
    });
  }
  
  attachEventListeners() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const lang = btn.getAttribute('data-lang');
        this.switchLanguage(lang);
      });
    });
  }
}

// Initialize language manager when DOM is ready
let languageManager;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    languageManager = new LanguageManager();
  });
} else {
  languageManager = new LanguageManager();
}

// Export for use in other scripts
window.LanguageManager = LanguageManager;
window.languageManager = languageManager;
