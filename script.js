// Menú Hamburguesa
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    menuToggle.classList.toggle("open");
});

// Datos de los productos
const productos = [
  {
    nombre: "Gorra Deportiva",
    descripcion: "Gorra cómoda y ligera para deportes.",
    imagen: "img/1.jpg",
    precio: "$7000"
  },
  {
    nombre: "Gorra de Algodón",
    descripcion: "Gorra de algodón ideal para el sol.",
    imagen: "img/2.jpg",
    precio: "$7000"
  },
  {
    nombre: "Gorra Casual",
    descripcion: "Gorra para un look casual y urbano.",
    imagen: "img/3.jpg",
    precio: "$7000"
  },
  {
    nombre: "Gorra de Invierno",
    descripcion: "Gorra abrigada para el frío invierno.",
    imagen: "img/4.jpg",
    precio: "$7000"
  },
  {
    nombre: "Gorra de Verano",
    descripcion: "Gorra ligera y fresca para el verano.",
    imagen: "img/5.jpg",
    precio: "$7000"
  },
  {
    nombre: "Gorra de Cuero",
    descripcion: "Gorra de cuero para un look elegante.",
    imagen: "img/6.jpg",
    precio: "$7000",
  },
];

// Contenedor de productos
const productosContainer = document.getElementById("productos-container");

// Intersection Observer para animaciones de imagen
const imagenes = document.querySelectorAll(".imagen");

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("mostrar");
            observer.unobserve(entry.target); // Desactiva después de mostrarse
        }
    });
}, { threshold: 0.3 }); // Activa la animación cuando el 30% de la imagen es visible

imagenes.forEach(img => observer.observe(img));

// Carrusel de Productos
let currentIndex = 0;
let index = 0;

function moveTo(i) {
    const produc = document.getElementById('produc');
    const totalItems = document.querySelectorAll('.articulos').length;
    const track = document.querySelector(".carousel-track");
    const slides = document.querySelectorAll(".carousel-item");

    // Cálculo del índice para evitar desbordamientos
    currentIndex = (i + totalItems) % totalItems;
    index = (i + slides.length) % slides.length;

    // Desplazamiento para el carrusel de productos
    produc.style.transform = `translateX(-${currentIndex * 320}px)`;

    // Desplazamiento para el carrusel de imágenes
    track.style.transform = `translateX(${-index * 100}%)`; 
}

// Botón de "Anterior" para productos
document.getElementById('prev-btn').addEventListener('click', () => moveTo(currentIndex - 1));

// Botón de "Siguiente" para productos
document.getElementById('next-btn').addEventListener('click', () => moveTo(currentIndex + 1));

document.addEventListener("DOMContentLoaded", () => {
    const truck = document.querySelector(".moving-truck");
    let movingRight = true; // Controla la dirección del movimiento

    function moveTruck() {
        if (movingRight) {
            truck.style.transform = "translateX(30px) rotate(-10deg)"; // Avanza y levanta el frente (willy)
        } else {
            truck.style.transform = "translateX(-30px) rotate(0deg)"; // Regresa normal
        }
        movingRight = !movingRight; // Cambia la dirección para el próximo movimiento
    }

    setInterval(moveTruck, 3000); // Se mueve cada 3 segundos
});