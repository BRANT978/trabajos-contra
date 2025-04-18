// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todas las funcionalidades
    initAnimations();
    initImageOverlays();
    initButtons();
    initScrollEffects();
    initThemeToggle();
    initSearchFunction();
    initModal();
});

// Animaciones de entrada
function initAnimations() {
    const temas = document.querySelectorAll('.tema');
    
    // Usar Intersection Observer para animaciones al hacer scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    temas.forEach(tema => {
        observer.observe(tema);
    });
}

// Efectos de hover en las imágenes
function initImageOverlays() {
    const imageContainers = document.querySelectorAll('.image-container');
    
    imageContainers.forEach(container => {
        const overlay = container.querySelector('.image-overlay');
        
        container.addEventListener('mouseenter', function() {
            overlay.style.opacity = '1';
        });
        
        container.addEventListener('mouseleave', function() {
            overlay.style.opacity = '0';
        });
    });
}

// Funcionalidad de los botones
function initButtons() {
    const shareButtons = document.querySelectorAll('.btn-accion');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (button.querySelector('.fa-share-alt')) {
                // Compartir
                const tema = this.closest('.tema');
                const titulo = tema.querySelector('h2').textContent.trim();
                const descripcion = tema.querySelector('.concepto p').textContent.trim();
                
                if (navigator.share) {
                    navigator.share({
                        title: titulo,
                        text: descripcion,
                        url: window.location.href
                    }).catch(err => console.log('Error al compartir:', err));
                } else {
                    // Fallback para navegadores que no soportan Web Share API
                    alert('Compartir: ' + titulo);
                }
            } else if (button.querySelector('.fa-bookmark')) {
                // Guardar
                const tema = this.closest('.tema');
                const titulo = tema.querySelector('h2').textContent.trim();
                
                // Simular guardado
                button.classList.toggle('active');
                if (button.classList.contains('active')) {
                    button.innerHTML = '<i class="fas fa-bookmark"></i> Guardado';
                    showNotification('Tema guardado: ' + titulo);
                } else {
                    button.innerHTML = '<i class="fas fa-bookmark"></i> Guardar';
                    showNotification('Tema eliminado de guardados: ' + titulo);
                }
            }
        });
    });
}

// Efectos de scroll
function initScrollEffects() {
    // Scroll suave para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Efecto parallax en el header
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY;
            header.style.backgroundPositionY = scrollPosition * 0.5 + 'px';
        });
    }
}

// Cambio de tema (claro/oscuro)
function initThemeToggle() {
    const body = document.body;
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    document.querySelector('.container').prepend(themeToggle);
    
    // Verificar preferencia guardada
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    themeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-theme');
        
        if (body.classList.contains('dark-theme')) {
            localStorage.setItem('theme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            localStorage.setItem('theme', 'light');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    });
}

// Función de búsqueda
function initSearchFunction() {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
        <input type="text" id="search-input" placeholder="Buscar temas...">
        <button id="search-button"><i class="fas fa-search"></i></button>
    `;
    
    document.querySelector('.header').appendChild(searchContainer);
    
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const temas = document.querySelectorAll('.tema');
    
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        
        temas.forEach(tema => {
            const titulo = tema.querySelector('h2').textContent.toLowerCase();
            const concepto = tema.querySelector('.concepto p').textContent.toLowerCase();
            const aporte = tema.querySelector('.aporte p').textContent.toLowerCase();
            
            if (titulo.includes(searchTerm) || concepto.includes(searchTerm) || aporte.includes(searchTerm)) {
                tema.style.display = 'flex';
                tema.classList.add('highlight');
            } else {
                tema.style.display = 'none';
                tema.classList.remove('highlight');
            }
        });
        
        // Mostrar mensaje si no hay resultados
        const visibleTemas = document.querySelectorAll('.tema[style="display: flex;"]');
        const noResultsMsg = document.getElementById('no-results-message');
        
        if (visibleTemas.length === 0) {
            if (!noResultsMsg) {
                const msg = document.createElement('div');
                msg.id = 'no-results-message';
                msg.textContent = 'No se encontraron resultados para: ' + searchTerm;
                document.querySelector('.friso').appendChild(msg);
            }
        } else if (noResultsMsg) {
            noResultsMsg.remove();
        }
    }
    
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

// Modal para ver detalles
function initModal() {
    // Crear modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div class="modal-body"></div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Añadir botón de "Ver más" a cada tema
    const temas = document.querySelectorAll('.tema');
    temas.forEach(tema => {
        const verMasBtn = document.createElement('button');
        verMasBtn.className = 'btn-ver-mas';
        verMasBtn.innerHTML = '<i class="fas fa-info-circle"></i> Ver más';
        
        tema.querySelector('.aporte').appendChild(verMasBtn);
        
        verMasBtn.addEventListener('click', function() {
            const titulo = tema.querySelector('h2').textContent.trim();
            const concepto = tema.querySelector('.concepto p').textContent.trim();
            const aporte = tema.querySelector('.aporte p').textContent.trim();
            
            const modalBody = modal.querySelector('.modal-body');
            modalBody.innerHTML = `
                <h2>${titulo}</h2>
                <div class="modal-image">
                    <img src="${tema.querySelector('img').src}" alt="${titulo}">
                </div>
                <div class="modal-info">
                    <h3>Concepto</h3>
                    <p>${concepto}</p>
                    <h3>Aporte Personal</h3>
                    <p>${aporte}</p>
                </div>
            `;
            
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Cerrar modal
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// Función para mostrar notificaciones
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Mostrar notificación
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Ocultar y eliminar después de 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Datos de los temas
const temas = [
    {
        id: 1,
        titulo: "Cambio Climático",
        icono: "fa-temperature-high",
        imagen: "images/cambio_climatico.png",
        caption: "Impacto del cambio climático en los ecosistemas",
        concepto: "El cambio climático es uno de los factores más determinantes en la pérdida de biodiversidad y el deterioro de funciones ecológicas esenciales. Sus efectos se manifiestan en:",
        puntos: [
            "Aumento global de temperaturas",
            "Alteración de patrones de lluvia",
            "Eventos climáticos extremos",
            "Pérdida de hábitats naturales"
        ],
        aporte: "Es fundamental difundir esta información y fomentar acciones desde el aula y el hogar, como reducir el uso de plásticos y promover el reciclaje."
    },
    {
        id: 2,
        titulo: "Biodiversidad",
        icono: "fa-leaf",
        imagen: "images/biodiversidad.png",
        caption: "Diversidad de especies en ecosistemas",
        concepto: "La biodiversidad no solo representa una riqueza ecológica, sino también un componente vital para el desarrollo sostenible. Incluye:",
        puntos: [
            "Diversidad de especies",
            "Variabilidad genética",
            "Ecosistemas únicos",
            "Interacciones biológicas"
        ],
        aporte: "Debemos exigir a los gobiernos una mayor protección de los ecosistemas y hacer nuestra parte consumiendo productos locales."
    },
    {
        id: 3,
        titulo: "Biodiversidad en la Alimentación",
        icono: "fa-seedling",
        imagen: "images/alimentacion.png",
        caption: "Diversidad de cultivos y alimentos",
        concepto: "La biodiversidad alimentaria es esencial para una dieta balanceada, resiliente y sostenible. Beneficios:",
        puntos: [
            "Mayor resistencia a plagas",
            "Mejor nutrición",
            "Sostenibilidad agrícola",
            "Preservación cultural"
        ],
        aporte: "Es importante consumir productos frescos y apoyar la agricultura local para mantener la diversidad alimentaria."
    },
    {
        id: 4,
        titulo: "Biomoléculas",
        icono: "fa-dna",
        imagen: "images/biomoleculas.png",
        caption: "Estructura de biomoléculas esenciales",
        concepto: "Las biomoléculas son componentes esenciales de los alimentos que influyen en funciones corporales vitales:",
        puntos: [
            "Proteínas para el crecimiento",
            "Carbohidratos para energía",
            "Lípidos para reservas",
            "Vitaminas para funciones"
        ],
        aporte: "Comprender la composición bioquímica de los alimentos nos ayuda a tomar mejores decisiones sobre nuestra alimentación."
    }
];

// Elementos del DOM
const frisoContainer = document.getElementById('friso-container');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const themeToggle = document.getElementById('theme-toggle');
const modal = document.getElementById('tema-modal');
const modalBody = document.querySelector('.modal-body');
const closeModal = document.querySelector('.close-modal');
const noResultsMessage = document.getElementById('no-results-message');
const notification = document.getElementById('notification');

// Función para crear un tema
function crearTema(tema) {
    const temaElement = document.createElement('div');
    temaElement.className = 'tema';
    temaElement.innerHTML = `
        <h2><i class="fas ${tema.icono}"></i> ${tema.titulo}</h2>
        <div class="image-container">
            <img src="${tema.imagen}" alt="${tema.titulo}">
            <div class="image-overlay">
                <span class="image-caption">${tema.caption}</span>
            </div>
        </div>
        <div class="concepto">
            <h3><i class="fas fa-lightbulb"></i> Concepto:</h3>
            <p>${tema.concepto}</p>
            <ul>
                ${tema.puntos.map(punto => `<li>${punto}</li>`).join('')}
            </ul>
        </div>
        <div class="aporte">
            <h3><i class="fas fa-user-edit"></i> Aporte Personal:</h3>
            <p>${tema.aporte}</p>
            <div class="acciones">
                <button class="btn-accion" onclick="compartirTema(${tema.id})">
                    <i class="fas fa-share-alt"></i> Compartir
                </button>
                <button class="btn-accion" onclick="guardarTema(${tema.id})">
                    <i class="fas fa-bookmark"></i> Guardar
                </button>
            </div>
        </div>
    `;
    
    // Agregar evento para abrir el modal
    temaElement.addEventListener('click', () => abrirModal(tema));
    
    return temaElement;
}

// Función para cargar todos los temas
function cargarTemas(temasAMostrar = temas) {
    frisoContainer.innerHTML = '';
    temasAMostrar.forEach(tema => {
        frisoContainer.appendChild(crearTema(tema));
    });
    
    // Mostrar u ocultar mensaje de no resultados
    noResultsMessage.style.display = temasAMostrar.length === 0 ? 'block' : 'none';
}

// Función para buscar temas
function buscarTemas(query) {
    const temasFiltrados = temas.filter(tema => 
        tema.titulo.toLowerCase().includes(query.toLowerCase()) ||
        tema.concepto.toLowerCase().includes(query.toLowerCase()) ||
        tema.aporte.toLowerCase().includes(query.toLowerCase())
    );
    
    cargarTemas(temasFiltrados);
}

// Función para abrir el modal
function abrirModal(tema) {
    modalBody.innerHTML = `
        <h2><i class="fas ${tema.icono}"></i> ${tema.titulo}</h2>
        <div class="image-container">
            <img src="${tema.imagen}" alt="${tema.titulo}">
            <div class="image-overlay">
                <span class="image-caption">${tema.caption}</span>
            </div>
        </div>
        <div class="concepto">
            <h3><i class="fas fa-lightbulb"></i> Concepto:</h3>
            <p>${tema.concepto}</p>
            <ul>
                ${tema.puntos.map(punto => `<li>${punto}</li>`).join('')}
            </ul>
        </div>
        <div class="aporte">
            <h3><i class="fas fa-user-edit"></i> Aporte Personal:</h3>
            <p>${tema.aporte}</p>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Función para compartir tema
function compartirTema(id) {
    const tema = temas.find(t => t.id === id);
    if (navigator.share) {
        navigator.share({
            title: tema.titulo,
            text: tema.concepto,
            url: window.location.href
        }).catch(console.error);
    } else {
        mostrarNotificacion('Función de compartir no disponible en este navegador');
    }
}

// Función para guardar tema
function guardarTema(id) {
    const tema = temas.find(t => t.id === id);
    // Aquí se podría implementar la lógica para guardar en localStorage o una base de datos
    mostrarNotificacion(`Tema "${tema.titulo}" guardado correctamente`);
}

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje) {
    notification.textContent = mensaje;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Función para cambiar el tema (claro/oscuro)
function cambiarTema() {
    document.body.classList.toggle('dark-theme');
    const icono = themeToggle.querySelector('i');
    icono.classList.toggle('fa-moon');
    icono.classList.toggle('fa-sun');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    cargarTemas();
    
    // Búsqueda
    searchButton.addEventListener('click', () => {
        buscarTemas(searchInput.value);
    });
    
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            buscarTemas(searchInput.value);
        }
    });
    
    // Cambio de tema
    themeToggle.addEventListener('click', cambiarTema);
    
    // Cerrar modal
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Efecto de hover en las imágenes
    document.addEventListener('mouseover', (e) => {
        const container = e.target.closest('.image-container');
        if (container) {
            const overlay = container.querySelector('.image-overlay');
            if (overlay) {
                overlay.style.opacity = '1';
            }
        }
    });
    
    document.addEventListener('mouseout', (e) => {
        const container = e.target.closest('.image-container');
        if (container) {
            const overlay = container.querySelector('.image-overlay');
            if (overlay) {
                overlay.style.opacity = '0';
            }
        }
    });
}); 