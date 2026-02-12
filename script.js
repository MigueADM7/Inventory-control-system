import { firebaseConfig } from './config.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc }
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const formContainer = document.getElementById('form-container');
const inventoryRoot = document.getElementById('inventory-root');

let todosLosProductos = [];

const abrirFormulario = () => formContainer.classList.remove('hidden');

const cerrarFormulario = () => {
  formContainer.classList.add('hidden');
  clearFields();
};

const clearFields = () => {
  document.getElementById('p-name').value = '';
  document.getElementById('p-category').value = '';
  document.getElementById('p-color').value = '';
  document.getElementById('p-size').value = '';
  document.getElementById('p-stock').value = '';
  document.getElementById('p-cost').value = '';
};

const renderizarInventario = () => {
  const filtro = document.getElementById('search-input').value.toLowerCase();
  inventoryRoot.innerHTML = "";

  const categories = {};
  let granTotalInversion = 0;

  const productosFiltrados = todosLosProductos.filter(p =>
    p.name.toLowerCase().includes(filtro) ||
    p.category.toLowerCase().includes(filtro)
  );

  productosFiltrados.forEach(p => {
    const catName = p.category.toUpperCase();
    if (!categories[catName]) categories[catName] = [];
    categories[catName].push(p);
  });

  const nombreCategoriasOrdenadas = Object.keys(categories).sort();

  nombreCategoriasOrdenadas.forEach(cat => {
    categories[cat].sort((a, b) => {
        const nombreDiff = a.name.localeCompare(b.name);
        if (nombreDiff !== 0) return nombreDiff;

        const colorDiff = (a.color || "").localeCompare(b.color || "");
        if (colorDiff !== 0) return colorDiff;

        const pesosTallas = {
            "unica": 0, "única": 0, "3xs": 1, "xxs": 2, "xs": 3, 
            "s": 4, "m": 5, "l": 6, "xl": 7, "xxl": 8, "xxxl": 9
        };

        const cleanSize = (t) => t.toString().toLowerCase().trim();
        const tallaA = cleanSize(a.size);
        const tallaB = cleanSize(b.size);

        if (pesosTallas[tallaA] !== undefined && pesosTallas[tallaB] !== undefined) {
            return pesosTallas[tallaA] - pesosTallas[tallaB];
        }

        const numA = parseFloat(tallaA);
        const numB = parseFloat(tallaB);
        if (!isNaN(numA) && !isNaN(numB)) {
            return numA - numB;
        }

        return tallaA.localeCompare(tallaB);
    });

    let totalCategoria = 0;
    const section = document.createElement('details');
    section.open = true;

    categories[cat].forEach(p => {
      totalCategoria += (Number(p.stock) * Number(p.cost));
    });

    granTotalInversion += totalCategoria;

    section.innerHTML = `
                    <summary>
                        <span>${cat}</span>
                        <span class="cat-total">Inversión: $${totalCategoria.toLocaleString()}</span>
                    </summary>
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Producto</th><th>Color</th><th>Talla</th>
                                    <th>Stock</th><th>Costo Unit.</th><th>Subtotal</th><th>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${categories[cat].map(p => `
                                    <tr>
                                        <td>${p.name}</td>
                                        <td>${p.color}</td>
                                        <td>${p.size}</td>
                                        <td><input type="number" min="0" value="${p.stock}" class="stock-input" data-id="${p.id}"></td>
                                        <td>$${p.cost.toLocaleString()}</td>
                                        <td>$${(p.stock * p.cost).toLocaleString()}</td>
                                        <td><button type="button" class="delete-btn" data-id="${p.id}">×</button></td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `;
    inventoryRoot.appendChild(section);
  });

  if (productosFiltrados.length > 0) {
    const totalDiv = document.createElement('div');
    totalDiv.className = 'grand-total-card';
    totalDiv.innerHTML = `<h3>Inversión Total del Inventario: <span>$${granTotalInversion.toLocaleString()}</span></h3>`;
    inventoryRoot.appendChild(totalDiv);
  } else if (filtro !== "") {
    inventoryRoot.innerHTML = `<p style="text-align:center; padding:50px; color:var(--text-light);">No se encontraron resultados para "${filtro}"</p>`;
  }
};

const exportarExcel = () => {
  if (todosLosProductos.length === 0) {
    alert("No hay datos para exportar.");
    return;
  }
  let csvContent = "Producto,Categoría,Color,Talla,Stock,Costo Unitario,Inversión Total\n";
  todosLosProductos.forEach(p => {
    const total = p.stock * p.cost;
    const row = [`"${p.name}"`,`"${p.category}"`,p.color,p.size,p.stock,p.cost,total].join(",");
    csvContent += row + "\n";
  });
  const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  const fecha = new Date().toLocaleDateString().replace(/\//g, '-');
  link.setAttribute("download", `Inventario_${fecha}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

document.getElementById('add-product-btn').addEventListener('click', abrirFormulario);
document.getElementById('btn-cancelar').addEventListener('click', cerrarFormulario);
document.getElementById('search-input').addEventListener('input', renderizarInventario);
document.getElementById('export-btn').addEventListener('click', exportarExcel);

document.getElementById('btn-guardar').addEventListener('click', async () => {
  const name = document.getElementById('p-name').value.trim();
  const category = document.getElementById('p-category').value.trim();
  const stockInput = Number(document.getElementById('p-stock').value);

  if (!name || !category) {
    alert("⚠️ Nombre y Categoría son obligatorios");
    return;
  }

  if (stockInput < 0) {
    alert("⚠️ El stock inicial no puede ser negativo");
    return;
  }

  const product = {
    name,
    category,
    color: document.getElementById('p-color').value || "-",
    size: document.getElementById('p-size').value || "-",
    stock: stockInput,
    cost: Number(document.getElementById('p-cost').value) || 0,
    timestamp: Date.now()
  };

  try {
    await addDoc(collection(db, "productos"), product);
    cerrarFormulario();
  } catch (e) {
    console.error(e);
    alert("Error al guardar");
  }
});

onSnapshot(collection(db, "productos"), (snapshot) => {
  todosLosProductos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  renderizarInventario();
});

inventoryRoot.addEventListener('click', async (e) => {
  const btnEliminar = e.target.closest('.delete-btn');
  if (btnEliminar) {
    const id = btnEliminar.getAttribute('data-id');
    if (confirm("¿Eliminar este producto permanentemente?")) {
      await deleteDoc(doc(db, "productos", id));
    }
  }
});

inventoryRoot.addEventListener('change', async (e) => {
  if (e.target.classList.contains('stock-input')) {
    const id = e.target.getAttribute('data-id');
    let nuevoStock = Number(e.target.value);
    if (nuevoStock < 0) {
      alert("⚠️ El stock no puede ser negativo.");
      e.target.value = 0;
      nuevoStock = 0;
    }
    try {
      await updateDoc(doc(db, "productos", id), { stock: nuevoStock });
    } catch (error) {
      console.error("Error al actualizar stock:", error);
    }
  }
});

// ==========================================
// ⚡ MODO DEMO: CARGADOR DE DATOS DE PRUEBA
// ==========================================

const productosDemo = [
  { name: "Camisa Polo", category: "Ropa Superior", color: "Azul", size: "S", stock: 10, cost: 25000 },
  { name: "Camisa Polo", category: "Ropa Superior", color: "Azul", size: "M", stock: 8, cost: 25000 },
  { name: "Camisa Polo", category: "Ropa Superior", color: "Rojo", size: "S", stock: 12, cost: 25000 },
  { name: "Jeans Slim", category: "Pantalones", color: "Negro", size: "30", stock: 10, cost: 45000 },
  { name: "Jeans Slim", category: "Pantalones", color: "Negro", size: "32", stock: 7, cost: 45000 },
  { name: "Tenis Deportivos", category: "Calzado", color: "Blanco", size: "40", stock: 5, cost: 80000 }
];

// AQUÍ ESTÁ EL CAMBIO: Usamos una constante y luego la asignamos a window
const cargarDatosDemo = async () => {
  const confirmacion = confirm("¿Cargar productos de prueba?");
  if (!confirmacion) return;
  for (const p of productosDemo) {
    await addDoc(collection(db, "productos"), { ...p, timestamp: Date.now() });
  }
  alert("¡Demo cargada!");
};

// EXPORTACIÓN MANUAL AL OBJETO WINDOW (Fundamental para la consola)
window.cargarDatosDemo = cargarDatosDemo;