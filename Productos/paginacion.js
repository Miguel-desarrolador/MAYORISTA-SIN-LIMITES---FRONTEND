// ==========================
// PAGINACIÓN MODULAR MEJORADA
// ==========================
export class Paginacion {
  constructor({ data = [], container, itemsPorPagina = 6, maxButtons = 3, onPageChange }) {
    this.data = data;
    this.container = container;
    this.itemsPorPagina = itemsPorPagina;
    this.maxButtons = maxButtons; // cantidad de botones visibles
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.data.length / this.itemsPorPagina);
    this.onPageChange = onPageChange;

    this.render();
    if (this.onPageChange) this.onPageChange(this.getCurrentPageData());
  }

  setData(newData) {
    this.data = newData || [];
    this.totalPages = Math.ceil(this.data.length / this.itemsPorPagina) || 1;
    this.currentPage = 1;
    this.render();
    if (this.onPageChange) this.onPageChange(this.getCurrentPageData());
  }

  goToPage(page) {
    if (page < 1) page = 1;
    if (page > this.totalPages) page = this.totalPages;
    this.currentPage = page;
    this.render();
    if (this.onPageChange) this.onPageChange(this.getCurrentPageData());

    // Scroll hacia arriba al cambiar de página
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  getCurrentPageData() {
    const start = (this.currentPage - 1) * this.itemsPorPagina;
    const end = start + this.itemsPorPagina;
    return this.data.slice(start, end);
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = "";
    this.container.classList.add("paginacion-container");

    // Botón Anterior
    const btnPrev = document.createElement("button");
    btnPrev.textContent = "« Anterior";
    btnPrev.classList.add("paginacion-btn");
    btnPrev.disabled = this.currentPage === 1;
    btnPrev.addEventListener("click", () => this.goToPage(this.currentPage - 1));
    this.container.appendChild(btnPrev);

    // Lógica para botones deslizantes
    let startPage = Math.max(1, this.currentPage);
    let endPage = Math.min(this.totalPages, startPage + this.maxButtons - 1);

    // Ajuste si estamos cerca del final
    if (endPage - startPage + 1 < this.maxButtons) {
      startPage = Math.max(1, endPage - this.maxButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.classList.add("paginacion-btn");
      if (i === this.currentPage) btn.classList.add("activo");
      btn.addEventListener("click", () => this.goToPage(i));
      this.container.appendChild(btn);
    }

    // Botón Siguiente
    const btnNext = document.createElement("button");
    btnNext.textContent = "Siguiente »";
    btnNext.classList.add("paginacion-btn");
    btnNext.disabled = this.currentPage === this.totalPages;
    btnNext.addEventListener("click", () => this.goToPage(this.currentPage + 1));
    this.container.appendChild(btnNext);
  }
}
