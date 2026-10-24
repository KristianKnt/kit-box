# 📦 kit-box — Mi primer kit-box

**kit-box** es un e-commerce de **kits temáticos**: en un solo lugar reúne todo lo que una persona necesita para empezar una nueva actividad, hobby o proyecto (herramientas, arte, mascotas y más).

Proyecto final del **Grupo 5** del bootcamp de Generation.

---

## 🎯 El problema que resolvemos

Quien quiere empezar algo nuevo tiene que buscar y comprar cada producto por separado. Eso hace perder tiempo, genera dudas sobre qué es realmente necesario y lleva a compras innecesarias.

- **Misión:** facilitar el inicio de nuevas experiencias, actividades y proyectos ofreciendo kits prácticos, organizados y accesibles que reúnan en un solo lugar todo lo necesario para comenzar.
- **Visión:** ser en 2028 una plataforma e-commerce reconocida en Colombia por ofrecer soluciones innovadoras en forma de kits.
- **Público objetivo:** personas de 18 a 45 años.

---

## 👩‍💻 Equipo de desarrollo

| Integrante | Rol |
|---|---|
| Cristhian Beltrán | Frontend & Backend |
| Diana Ocampo | Desarrolladora Backend |
| Cristian Rojas | Desarrollador Backend |
| Juliana Bernal | Frontend & Backend |
| Dayana Vallejo | Frontend & Backend |

---

## 🛠️ Tecnologías

- **HTML5, CSS3 y JavaScript** (módulos ES con `import` / `export`)
- **Bootstrap 5.3.8** (por CDN e instalado en el repositorio)
- **Formspree** para enviar el formulario de contacto
- **localStorage** para guardar los productos que se agregan desde el administrador
- **Figma** para los wireframes y el UI Kit
- **Git y GitHub** para el trabajo en equipo
- **Live Server** (extensión de VS Code) para ver el proyecto

---

## ▶️ Cómo ver el proyecto

1. Clona el repositorio:
   ```bash
   git clone https://github.com/KristianKnt/kit-box.git
   ```
2. Ábrelo en VS Code.
3. Abre `index.html` (el de la raíz) con **Live Server**. Este archivo te redirige solo a `src/index.html`.

> ⚠️ Hay que usar **Live Server**. Si abres los HTML con doble clic, el `fetch` no funciona y no cargan el header, el footer ni los productos.

---

## 📁 Estructura de carpetas

```
kit-box/
├── index.html                  → redirige a src/index.html
├── package.json                → dependencia de Bootstrap
└── src/
    ├── index.html              → página de inicio
    ├── assets/imagenes/        → imágenes por página y fotos de los kits (img_json/)
    ├── components/             → piezas que se repiten
    │   ├── header/
    │   ├── footer/
    │   └── home-pages/         → banner, carrusel y "cómo funciona" del inicio
    ├── css/
    │   └── global.css          → paleta, fuente y reset compartidos
    ├── data/
    │   └── productos.json      → catálogo de productos
    ├── js/
    │   └── components.js       → carga el header, el footer y los componentes
    └── tienda/
        ├── admin/              → panel de administrador
        ├── catalogo/           → catálogo de kits
        ├── contacto/           → formulario de contacto
        └── nosotros/           → quiénes somos
```

---

## 📄 Páginas

| Página | Qué tiene | Estado |
|---|---|---|
| **Inicio** | Banner, carrusel de kits destacados y sección "cómo funciona" | ✅ Lista |
| **Nosotros** | Problema, misión, visión, valores y equipo, con animación al hacer scroll | ✅ Lista |
| **Contacto** | Formulario con validación en JavaScript (regex), envío con Formspree, mapa e información de contacto | ✅ Lista |
| **Administrador** | Formulario para agregar productos y tabla con los productos | 🚧 En progreso |
| **Catálogo** | Listado de kits para comprar | ⏳ Pendiente |

---

## ⚙️ Cómo funciona

### Componentes (header, footer y más)
No copiamos el header y el footer en cada página. Cada HTML tiene un `div` vacío con un `id` (por ejemplo `<div id="header"></div>`), y `src/js/components.js` lo llena:

1. Busca el `div` por su `id`.
2. Trae el archivo HTML del componente con `fetch`.
3. Mete ese HTML dentro del `div`.
4. Arregla las rutas de imágenes y enlaces para que funcionen desde cualquier carpeta.

### Productos (`src/data/productos.json`)
Cada producto tiene esta forma:

```json
{
  "id": "herr_01",
  "nombre": "Kit Básico para el Hogar",
  "descripcion": "Lo esencial para reparaciones rápidas y mantenimiento diario.",
  "precio": 45000,
  "imagen": "kit-box/src/assets/imagenes/img_json/01_Kit_de_Herramientas/herr_01.jpg",
  "stock": 10,
  "categoria": "Kit de Herramientas",
  "destacado": false
}
```

Por ahora hay 12 productos en 3 categorías: Herramientas, Arte y Mascotas.

### Panel de administrador (`src/tienda/admin/`)

| Archivo | Para qué sirve |
|---|---|
| `admin.html` | La página: tabla a la izquierda y formulario a la derecha |
| `admin.js` | Lee el formulario, valida los datos y agrega el producto |
| `lista.js` | Guarda la lista de productos: la carga del JSON o de localStorage y agrega productos nuevos con un `id` |
| `storage.js` | Guarda y lee los productos en localStorage |
| `tabla.js` | Dibuja la tabla de productos |
| `tablaAdmStyles.css` | Estilos de la tabla |

El formulario tiene 7 campos, todos obligatorios: nombre, descripción, precio, imagen, stock, categoría y destacado (Sí/No). El `id` no se escribe en el formulario: lo pone el sistema.

---

## 🎨 Guía de estilo

**Paleta de colores**

| Color | Código | Uso |
|---|---|---|
| Bosque | `#1E4437` | Color principal, títulos |
| Oliva | `#586F57` | Header y footer |
| Salvia | `#8FAE9A` | Detalles |
| Marrón suave | `#886F56` | Botones |
| Beige cálido | `#EFEBE2` | Fondo de formularios y tarjetas |
| Gris | `#E7E8E3` | Fondo general |

- **Fuente:** Inter
- **Breakpoints:** 1280px (portátil), 900px (tablet) y 576px (celular)

---

## 🌿 Flujo de trabajo con Git

1. **Nadie trabaja directo en `Main`.** Siempre en una rama propia.
2. Antes de empezar, actualiza `Main` y crea tu rama desde ahí:
   ```bash
   git checkout Main
   git pull
   git checkout -b Nombre/tarea
   ```
   Ejemplos de nombres de rama: `Dayana/FormAdmin`, `feature/json`, `bannerHome/diana`.
3. Guarda y sube tu trabajo:
   ```bash
   git add .
   git commit -m "Qué hiciste, en pocas palabras"
   git push -u origin Nombre/tarea
   ```
4. En GitHub abre un **pull request** de tu rama hacia `Main` para que el equipo lo revise.
5. Para traer lo nuevo del equipo a tu rama:
   ```bash
   git pull origin Main
   ```

---

## ✍️ Convenciones del equipo

- **Sangría de 2 espacios** en el código.
- **Bootstrap 5.3** para la estructura, y CSS propio de cada página o componente para los estilos.
- Los `id` de los formularios empiezan por `dato-` (por ejemplo `dato-nombre`, `dato-precio`) y los mensajes de error por `error-dato-`.
- Cada página vive en su propia carpeta dentro de `src/tienda/`, con su `.html`, `.css` y `.js`.
