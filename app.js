 // Menú Hamburguesa
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
const links = document.querySelectorAll("#nav-links a"); // Selecciona todos los enlaces del menú

menuToggle.addEventListener("click", () => {
navLinks.classList.toggle("active");
menuToggle.classList.toggle("open");
});

// Cerrar el menú al hacer clic en un enlace
links.forEach(link => {
link.addEventListener("click", () => {
navLinks.classList.remove("active"); // Cierra el menú
menuToggle.classList.remove("open"); // Cambia el ícono del menú
});
});




// BOTON SCROLL - SUBE ARRIBA DE TODO
  const scrollBtn = document.querySelector('.scroll-to-top');
  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

// Ahora (Railway)
const API_URL = "https://mayorista-sin-limites-backend-production.up.railway.app/productos";


// DOM Elements
const productosContainer = document.getElementById("productos");
const carritoFlotante = document.getElementById("carritoFlotante");
const carritoProductos = document.getElementById("carritoProductos");
const totalCarritoSpan = document.getElementById("totalCarrito");
const cantidadCarritoSpan = document.getElementById("cantidadCarrito");
const iconoCarrito = document.getElementById("iconoCarrito");
const cerrarCarritoBtn = document.getElementById("cerrarCarrito");
const finalizarCompraBtn = document.getElementById("finalizarCompra");
const vaciarCarritoBtn = document.getElementById("vaciarCarrito");
const buscadorTexto = document.getElementById("buscadorTexto");
const filtroCategoria = document.getElementById("filtroCategoria");

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let productosDB = [];

// MODAL CLIENTE
const modalDatosCliente = document.getElementById("modalDatosCliente");
const formDatosCliente = document.getElementById("formDatosCliente");
const cerrarModalDatos = document.getElementById("cerrarModalDatos");
const btnIrCompras = document.getElementById("btnIrCompras");



iconoCarrito.addEventListener("click", () => {
  carritoFlotante.classList.toggle("abierto");
});

cerrarCarritoBtn.addEventListener("click", () => {
  carritoFlotante.classList.remove("abierto");
});


// Cargar productos
async function cargarProductos() {
  try {
    const res = await fetch(API_URL);
    productosDB = await res.json();

    cargarCategorias();

    // Inicializar paginador
    paginador = new Paginacion({
      data: [...productosDB].sort((a, b) => b.id - a.id), // productos nuevos primero
      container: contenedorPaginacion,
      itemsPorPagina: 12,
      onPageChange: (productosPagina) => {
        renderizarProductos(productosPagina);
      }
    });

    renderizarCarrito();
    actualizarStockVisual();
  } catch (error) {
    console.error("Error cargando productos:", error);
  }
}


// Renderizar productos con nuevo primero
function renderizarProductos(listaProductos) {
  productosContainer.innerHTML = listaProductos.map((p, index) => `
    <div class="producto" data-id="${p.id}" data-aos="fade-right" >
      <img src="https://mayorista-sin-limites-backend-production.up.railway.app/img/productos/${p.imagen}
" alt="${p.nombre}">
      <h3>${p.nombre}</h3>
      <p class="precio">Precio: $${p.precio}</p>
      <p class="stock">Stock: ${p.stock}</p>
      <div class="cantidad-control">
        <button class="btn-menos">-</button>
        <span class="cantidad">0</span>
        <button class="btn-mas">+</button>
      </div>
      <button class="btn-agregar">Agregar a carrito</button>
      <button class="btn-eliminar-producto btn-especial" type="button">Eliminar Producto</button>
      <button class="btn-editar-stock btn-especial" type="button">Editar Stock</button>
    </div>
  `).join("");

  asignarEventosProductos(listaProductos);

  // Mostrar u ocultar botones especiales según acceso
  const botonesEspeciales = document.querySelectorAll(".btn-especial");
  botonesEspeciales.forEach(btn => {
    btn.style.display = accesoEmpleado ? "inline-block" : "none";
  });

  // Inicializar AOS en los nuevos elementos
  AOS.refresh();
}



// ==========================
// ELEMENTOS MODAL AGREGAR PRODUCTO
// ==========================
const btnAbrirModal = document.getElementById("btnAbrirModal");
const modalAgregarProducto = document.getElementById("modalAgregarProducto");
const formAgregarProducto = document.getElementById("formAgregarProducto");
const inputImagen = document.getElementById("inputImagen");
const previewImagen = document.getElementById("previewImagen");
const inputCategoria = document.getElementById("inputCategoria");
const inputNuevaCategoria = document.getElementById("inputNuevaCategoria");


// ==========================
// CARGAR CATEGORÍAS EN EL SELECT DEL MODAL
// ==========================
function cargarCategoriasModal() {
  const categorias = [...new Set(productosDB.map(p => p.categoria))]; // Extrae categorías únicas
  inputCategoria.innerHTML = categorias.map(c => `<option value="${c}">${c}</option>`).join("");
  inputCategoria.insertAdjacentHTML("afterbegin", `<option value="">Seleccionar categoría</option>`);
}


// ==========================
// CERRAR MODAL AGREGAR PRODUCTO
// ==========================
const btnCerrarModal = document.getElementById("btnCerrarModal");

btnCerrarModal.addEventListener("click", () => {
  modalAgregarProducto.classList.add("oculto");
  formAgregarProducto.reset();
  previewImagen.src = "";
  previewImagen.style.display = "none";
});

// ==========================
// ABRIR MODAL CON CATEGORÍAS
// ==========================
btnAbrirModal.addEventListener("click", () => {
  modalAgregarProducto.classList.remove("oculto");
  inputNombre.value = "";
  inputPrecio.value = "";
  inputStock.value = "";
  inputNuevaCategoria.value = "";
  inputImagen.value = "";
  previewImagen.src = "";
  previewImagen.style.display = "none";

  cargarCategoriasModal(); // <-- Cargar categorías al abrir modal
});


// ==========================
// PREVIEW DE IMAGEN
// ==========================
inputImagen.addEventListener("change", () => {
  const file = inputImagen.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      previewImagen.src = e.target.result;
      previewImagen.style.display = "block";
    };
    reader.readAsDataURL(file);
  } else {
    previewImagen.src = "";
    previewImagen.style.display = "none";
  }
});


// ==========================
// AGREGAR NUEVO PRODUCTO
// ==========================
formAgregarProducto.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Obtener datos del formulario
  const nombre = document.getElementById("inputNombre").value;
  const precio = parseFloat(document.getElementById("inputPrecio").value);
  const stock = parseInt(document.getElementById("inputStock").value);
  let categoria = inputCategoria.value;
  const nuevaCategoria = inputNuevaCategoria.value.trim();

  if (nuevaCategoria) categoria = nuevaCategoria;

  const formData = new FormData();
  formData.append("nombre", nombre);
  formData.append("precio", precio);
  formData.append("stock", stock);
  formData.append("categoria", categoria);
  if (inputImagen.files[0]) formData.append("imagen", inputImagen.files[0]);

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      body: formData
    });

    if (!res.ok) throw new Error("Error al agregar producto");
    const nuevoProducto = await res.json();

    // Agregar el producto al inicio del array para que se vea primero
    productosDB.unshift(nuevoProducto); 
    renderizarProductos(productosDB);
    cargarCategorias();

    // Mantener acceso empleado activo si corresponde
    if (accesoEmpleado) mostrarBotonesEspeciales();

    // Cerrar modal y resetear formulario
    modalAgregarProducto.classList.add("oculto");
    formAgregarProducto.reset();
    previewImagen.style.display = "none";
    alert("Producto agregado correctamente!");
  } catch (err) {
    console.error(err);
    alert("No se pudo agregar el producto. Intenta de nuevo.");
  }
});






// Asignar eventos
function asignarEventosProductos(productos) {
  productos.forEach(p => {
    const productoDiv = document.querySelector(`.producto[data-id="${p.id}"]`);
    if (!productoDiv) return;

    productoDiv.querySelector(".btn-agregar").addEventListener("click", () => agregarAlCarrito(p.id));
    productoDiv.querySelector(".btn-mas").addEventListener("click", () => agregarAlCarrito(p.id));
    productoDiv.querySelector(".btn-menos").addEventListener("click", () => decrementarCantidad(p.id));

    productoDiv.querySelector(".btn-editar-stock").addEventListener("click", async () => {
      const nuevoStock = prompt(`Ingrese nuevo stock para "${p.nombre}":`, p.stock);
      const stockNumber = parseInt(nuevoStock);
      if (isNaN(stockNumber) || stockNumber < 0) return;
      try {
        const res = await fetch(`${API_URL}/${p.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stock: stockNumber })
        });
        if (!res.ok) throw new Error("Error al actualizar stock");
        p.stock = stockNumber;
        const itemCarrito = carrito.find(c => c.id === p.id);
        if (itemCarrito) itemCarrito.stock = stockNumber;
        guardarCarrito();
        alert("Stock actualizado correctamente!");
      } catch (error) {
        console.error(error);
        alert("No se pudo actualizar el stock.");
      }
    });

    productoDiv.querySelector(".btn-eliminar-producto").addEventListener("click", async (e) => {
  e.preventDefault(); // <-- Evita que se haga submit
  if (!confirm(`¿Deseas eliminar "${p.nombre}" de la base de datos?`)) return;
  try {
    const res = await fetch(`${API_URL}/${p.id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Error al eliminar producto");
    productosDB = productosDB.filter(prod => prod.id !== p.id);
    carrito = carrito.filter(c => c.id !== p.id);
    productoDiv.remove();
    guardarCarrito();
    alert("Producto eliminado correctamente!");
  } catch (error) {
    console.error(error);
    alert("No se pudo eliminar el producto.");
  }
});

  });
  actualizarStockVisual();
}

// Carrito
function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
  renderizarCarrito();
  actualizarStockVisual();
}

function agregarAlCarrito(id) {
  const productoDB = productosDB.find(p => p.id === id);
  if (!productoDB) return;
  const productoExistente = carrito.find(p => p.id === id);
  if (productoExistente) {
    if (productoExistente.cantidad < productoDB.stock) productoExistente.cantidad++;
    else { alert("No hay más stock disponible!"); return; }
  } else {
    carrito.push({ id: productoDB.id, nombre: productoDB.nombre, precio: productoDB.precio, imagen: productoDB.imagen, cantidad: 1, stock: productoDB.stock });
  }
  guardarCarrito();
}

function decrementarCantidad(id) {
  const producto = carrito.find(p => p.id === id);
  if (producto) {
    if (producto.cantidad > 1) producto.cantidad--;
    else carrito = carrito.filter(p => p.id !== id);
    guardarCarrito();
  }
}

function eliminarDelCarrito(id) {
  carrito = carrito.filter(p => p.id !== id);
  guardarCarrito();
}

// Renderizar carrito
function renderizarCarrito() {
  carritoProductos.innerHTML = "";
  let total = 0, cantidadTotal = 0;

  carrito.forEach(p => {
    const subtotal = p.precio * p.cantidad;
    total += subtotal;
    cantidadTotal += p.cantidad;

    const div = document.createElement("div");
    div.classList.add("carrito-item");
    div.innerHTML = `
      <img src="https://mayorista-sin-limites-backend-production.up.railway.app/img/productos/${p.imagen}
" alt="${p.nombre}">
      <div class="carrito-info">
        <p><strong>${p.nombre}</strong></p>
        <p>Precio: $${p.precio}</p>
        <p>Stock: ${p.stock}</p>
        <p class="subtotal">Subtotal: $${subtotal}</p>
        <div class="carrito-cantidad">
          <button class="btn-menos">-</button>
          <span>${p.cantidad}</span>
          <button class="btn-mas">+</button>
        </div>
      </div>
      <button class="btn-eliminar-carrito">Eliminar</button>
    `;

    div.querySelector(".btn-mas").addEventListener("click", () => agregarAlCarrito(p.id));
    div.querySelector(".btn-menos").addEventListener("click", () => decrementarCantidad(p.id));
    div.querySelector(".btn-eliminar-carrito").addEventListener("click", () => eliminarDelCarrito(p.id));

    carritoProductos.appendChild(div);
  });

  totalCarritoSpan.textContent = total;
  cantidadCarritoSpan.textContent = cantidadTotal;
}

// Stock visual
function actualizarStockVisual() {
  productosDB.forEach(prod => {
    const productoDiv = document.querySelector(`.producto[data-id="${prod.id}"]`);
    if (!productoDiv) return;

    const stockSpan = productoDiv.querySelector(".stock");
    const cantidadSpan = productoDiv.querySelector(".cantidad");
    const btnAgregar = productoDiv.querySelector(".btn-agregar");
    const btnMas = productoDiv.querySelector(".btn-mas");

    const carritoItem = carrito.find(p => p.id === prod.id);
    const cantidadEnCarrito = carritoItem ? carritoItem.cantidad : 0;
    const stockRestante = Math.max(prod.stock - cantidadEnCarrito, 0);

    // Actualizar texto de stock
    stockSpan.textContent = `Stock: ${stockRestante}`;
    if (cantidadSpan) cantidadSpan.textContent = cantidadEnCarrito;

    // Manejo botón "Agregar a carrito"
    if (btnAgregar) {
      if (stockRestante === 0) {
        btnAgregar.textContent = "Sin stock";
        btnAgregar.disabled = true;
        btnAgregar.style.background = "red";
        btnAgregar.style.cursor = "not-allowed";
      } else {
        btnAgregar.textContent = "AGREGAR A CARRITO";
        btnAgregar.disabled = false;
        btnAgregar.style.background = "#28a745";
        btnAgregar.style.cursor = "pointer";
      }
    }

    // Manejo botón "+"
    if (btnMas) {
      if (stockRestante === 0) {
        btnMas.disabled = true;
        btnMas.style.background = "red";
        btnMas.style.cursor = "not-allowed";
      } else {
        btnMas.disabled = false;
        btnMas.style.background = "#28a745";
        btnMas.style.cursor = "pointer";
      }
    }

    // Actualizar stock en carrito
    if (carritoItem) carritoItem.stock = prod.stock;
  });
}


// Vaciar carrito
vaciarCarritoBtn.addEventListener("click", () => {
  if (carrito.length === 0) { alert("El carrito ya está vacío!"); return; }
  if (confirm("¿Deseas vaciar todo el carrito?")) { carrito = []; guardarCarrito(); }
});

// Filtros
buscadorTexto.addEventListener("input", filtrarProductos);
filtroCategoria.addEventListener("change", filtrarProductos);
function filtrarProductos() {
  const texto = buscadorTexto.value.toLowerCase();
  const categoria = filtroCategoria.value;

  const filtrados = productosDB.filter(p =>
    p.nombre.toLowerCase().includes(texto) &&
    (categoria === "" || p.categoria === categoria)
  );

  // Ordenar productos nuevos primero
  const filtradosOrdenados = [...filtrados].sort((a, b) => b.id - a.id);

  // Actualizar paginador
  paginador.setData(filtradosOrdenados);
}

// Categorías
function cargarCategorias() {
  const categorias = [...new Set(productosDB.map(p => p.categoria))];
  filtroCategoria.innerHTML = `<option value="">Todas las categorías</option>` + categorias.map(c => `<option value="${c}">${c}</option>`).join("");
}
// ==========================
// ELEMENTOS DEL DOM
// ==========================
const btnAutocompletar = document.getElementById("btnAutocompletar");

// ==========================
// ABRIR MODAL
// ==========================
finalizarCompraBtn.addEventListener("click", async () => {
  if (carrito.length === 0) { 
    alert("El carrito está vacío!"); 
    return; 
  }

  try {
    const res = await fetch(API_URL);
    const productosDB = await res.json();

    const sinStock = carrito.filter(item => {
      const prod = productosDB.find(p => p.id === item.id);
      return !prod || prod.stock < item.cantidad;
    });

    if (sinStock.length > 0) {
      alert(`Productos sin stock suficiente: ${sinStock.map(p => p.nombre).join(", ")}`);
      carrito = carrito.filter(item => !sinStock.includes(item));
      guardarCarrito();
      return;
    }

    modalDatosCliente.classList.remove("oculto");
  } catch (err) {
    console.error(err);
    alert("Error al verificar stock");
  }
});

// ==========================
// CERRAR MODAL
// ==========================
cerrarModalDatos.addEventListener("click", () => {
  modalDatosCliente.classList.add("oculto");
  formDatosCliente.reset();
});

// ==========================
// AUTOCOMPLETAR DATOS DEL CLIENTE
// ==========================
btnAutocompletar.addEventListener("click", () => {
  const datosGuardados = JSON.parse(localStorage.getItem("datosCliente"));
  if (!datosGuardados) {
    alert("No se encontraron datos guardados previamente.");
    return;
  }

  document.getElementById("inputNombreCliente").value = datosGuardados.nombre || "";
  document.getElementById("inputDNI").value = datosGuardados.dni || "";
  document.getElementById("inputCelular").value = datosGuardados.celular || "";
  document.getElementById("inputProvincia").value = datosGuardados.provincia || "";
  document.getElementById("inputLocalidad").value = datosGuardados.localidad || "";
  document.getElementById("inputCodigoPostal").value = datosGuardados.codigoPostal || "";
  document.getElementById("inputEmailCliente").value = datosGuardados.email || "";
  document.getElementById("selectEnvio").value = datosGuardados.envio || "Correo Argentino";
  document.getElementById("selectDispositivo").value = datosGuardados.dispositivo || "Android";
});


// ==========================
// FUNCION HELPER PARA CAPITALIZAR
// ==========================
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ==========================
// FINALIZAR COMPRA Y GENERAR PDF
// ==========================
formDatosCliente.addEventListener("submit", async (e) => {
  e.preventDefault();

  const datosCliente = {
    nombre: document.getElementById("inputNombreCliente").value,
    dni: document.getElementById("inputDNI").value,
    celular: document.getElementById("inputCelular").value,
    provincia: document.getElementById("inputProvincia").value,
    localidad: document.getElementById("inputLocalidad").value,
    codigoPostal: document.getElementById("inputCodigoPostal").value,
    email: document.getElementById("inputEmailCliente").value,
    envio: document.getElementById("selectEnvio").value,
    dispositivo: document.getElementById("selectDispositivo").value
  };

  try {
    // Actualizar stock en el servidor y local
    for (let item of carrito) {
      const res = await fetch(`${API_URL}/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: item.stock - item.cantidad })
      });
      if (!res.ok) throw new Error(`Error actualizando stock de ${item.nombre}`);

      const productoLocal = productosDB.find(p => p.id === item.id);
      if (productoLocal) productoLocal.stock -= item.cantidad;
    }

    // Guardar datos en localStorage
    localStorage.setItem("datosCliente", JSON.stringify(datosCliente));

    // --------------------------
    // CREAR PDF CORRECTO
    // --------------------------
    await generarPDF(datosCliente, carrito); // <--- Aquí estaba el error, ahora pasamos carrito

    // Limpiar carrito y modal
    carrito = [];
    guardarCarrito();
    actualizarStockVisual();
    modalDatosCliente.classList.add("oculto");
    formDatosCliente.reset();
    alert("Compra realizada con éxito!");
  } catch (err) {
    console.error(err);
    alert("Error finalizando la compra, intente más tarde.");
  }
});

// ==========================
// GENERAR PDF EN BACKEND
// ==========================
async function generarPDF(datosCliente, carrito) {
  try {
  const res = await fetch("https://mayorista-sin-limites-backend-production.up.railway.app/api/compras/pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ datosCliente, carrito }) // carrito ya definido
  });

    const data = await res.json();
    console.log("PDF guardado en backend:", data.filePath);
    console.log("Link WhatsApp:", data.urlWhatsApp);

    // Abrir WhatsApp
    window.open(data.urlWhatsApp, "_blank");
  } catch (err) {
    console.error("Error generando PDF:", err);
  }
}


// ==========================
// ACCESO EMPLEADOS
// ==========================
const btnAbrirCodigo = document.getElementById("btnAbrirCodigo");
const modalCodigo = document.getElementById("modalCodigo");
const btnCerrarModalCodigo = document.getElementById("btnCerrarModalCodigo");
const btnValidarCodigo = document.getElementById("btnValidarCodigo");
const inputCodigoAcceso = document.getElementById("inputCodigoAcceso");
const btnAgregarProducto = document.getElementById("btnAbrirModal");

const CODIGO_EMPLEADO = "1234";

// Recuperar estado del localStorage
let accesoEmpleado = localStorage.getItem("accesoEmpleado") === "true";

// ==========================
// FUNCIONES
// ==========================
function abrirModalCodigo() {
  modalCodigo.classList.remove("oculto");
  inputCodigoAcceso.value = "";
  inputCodigoAcceso.focus();
}

function cerrarModalCodigo() {
  modalCodigo.classList.add("oculto");
  inputCodigoAcceso.value = "";
}

function mostrarBotonesEspeciales() {
  document.querySelectorAll(".btn-editar-stock, .btn-eliminar-producto").forEach(btn => {
    btn.style.display = "inline-block";
  });
  btnAgregarProducto.style.display = "inline-block";
  if(btnIrCompras) btnIrCompras.style.display = "inline-block"; // mostrar
}

function ocultarBotonesEspeciales() {
  document.querySelectorAll(".btn-editar-stock, .btn-eliminar-producto").forEach(btn => {
    btn.style.display = "none";
  });
  btnAgregarProducto.style.display = "none";
  if(btnIrCompras) btnIrCompras.style.display = "none"; // ocultar
}


// ==========================
// EVENTOS
// ==========================
btnAbrirCodigo.addEventListener("click", () => {
  if (accesoEmpleado) {
    // Cerrar sesión
    accesoEmpleado = false;
    localStorage.setItem("accesoEmpleado", "false");
    ocultarBotonesEspeciales();
    btnAbrirCodigo.textContent = "💼 Acceso Empleados";
    alert("Sesión de empleado cerrada.");
  } else {
    abrirModalCodigo();
  }
});

btnValidarCodigo.addEventListener("click", () => {
  const codigoIngresado = inputCodigoAcceso.value.trim();
  if (codigoIngresado === CODIGO_EMPLEADO) {
    accesoEmpleado = true;
    localStorage.setItem("accesoEmpleado", "true");
    mostrarBotonesEspeciales();
    btnAbrirCodigo.textContent = "Cerrar Sesión";
    alert("Código correcto. Acceso concedido.");
    cerrarModalCodigo();
  } else {
    alert("Código incorrecto. Intente nuevamente.");
    inputCodigoAcceso.value = "";
    inputCodigoAcceso.focus();
  }
});

inputCodigoAcceso.addEventListener("keydown", (e) => {
  if (e.key === "Enter") btnValidarCodigo.click();
});

modalCodigo.addEventListener("click", (e) => {
  if (e.target === modalCodigo) cerrarModalCodigo();
});

btnCerrarModalCodigo.addEventListener("click", cerrarModalCodigo);

// ==========================
// ESTADO INICIAL
// ==========================
if (accesoEmpleado) {
  mostrarBotonesEspeciales();
  btnAbrirCodigo.textContent = "Cerrar Sesión";
} else {
  ocultarBotonesEspeciales();
  btnAbrirCodigo.textContent = "💼 Acceso Empleados";
}


import { Paginacion } from "./paginacion.js";

const contenedorPaginacion = document.getElementById("paginacion");

let paginador = new Paginacion({
  data: productosDB,
  container: contenedorPaginacion,
  itemsPorPagina: 8,
  onPageChange: (productosPagina) => {
    renderizarProductos(productosPagina);
  }
});

// Actualizar si cambias filtros
function actualizarProductosFiltrados(filtrados) {
  paginador.setData(filtrados);
}



// Inicializar
cargarProductos();
