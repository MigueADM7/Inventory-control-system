# [📦 Inventory Flow - Sistema de Gestión](https://inventario-demo-migueadm.web.app/)

> Una solución ágil y moderna para la monitorización de stock y control de inventarios en tiempo real.

[![Firebase Deployment](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=firebase&logoColor=white)](https://inventario-demo-migueadm.web.app/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/es/docs/Web/JavaScript)

Esta aplicación permite gestionar flujos de mercancía, costos de inversión y variantes de productos mediante una interfaz intuitiva y persistencia de datos en la nube, ayudando a optimizar la toma de decisiones sobre el inventario.

---

## 🚀 Características Principales

* **Sincronización en Tiempo Real:** Persistencia y actualización instantánea de datos con \`Firebase Firestore\`.
* **Cálculos Automáticos:** Monitorización de inversión por categoría y gran total del inventario en tiempo real.
* **Ordenamiento Inteligente:** Algoritmo avanzado que organiza productos por nombre, color y peso lógico de tallas.
* **Exportación de Datos:** Generación de reportes dinámicos en formato \`CSV\` listos para análisis en Excel.
* **Interfaz Adaptativa:** Diseño colapsable y responsive diseñado para agilizar la lectura en cualquier dispositivo.

## 🛠️ Tech Stack

| Tecnología | Uso |
| :--- | :--- |
| **Vanilla JavaScript** | Lógica de negocio, manipulación del DOM y algoritmos de ordenamiento. |
| **Firebase Firestore** | Base de datos NoSQL para almacenamiento en tiempo real. |
| **Firebase Hosting** | Despliegue y distribución de la aplicación web. |
| **CSS3 Custom Props** | Diseño moderno utilizando variables y sistemas de maquetación Flexbox/Grid. |
| **HTML5 Semántico** | Estructura de la aplicación optimizada para accesibilidad. |

## 📸 Vista Previa
> [!TIP]
> **Inserta aquí tu captura de pantalla.** Puedes simplemente arrastrar la imagen dentro de este archivo en GitHub una vez que lo hayas guardado para que se genere el link automáticamente.

## 📂 Estructura del Proyecto

\`\`\`text
INVENTARIO/
├── .firebase/        # Configuración interna del CLI de Firebase
├── config.js         # Variables de configuración y conexión al SDK
├── index.html        # Punto de entrada y estructura semántica
├── script.js         # Lógica central (CRUD, Firebase Ops, Sorting)
├── style.css         # Definición de estilos y diseño responsive
└── firebase.json     # Reglas de hosting y redirecciones de seguridad
\`\`\`
EOF