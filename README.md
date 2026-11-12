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
| Diana Ocampo | Frontend & Backend |
| Cristian Rojas | Frontend & Backend |
| Juliana Bernal | Frontend & Backend |
| Dayana Vallejo | Frontend & Backend |

---

## 🛠️ Tecnologías

- **HTML5, CSS3 y JavaScript** (módulos ES con `import` / `export`)
- **Bootstrap 5.3.8** (por CDN e instalado en el repositorio)
- **Formspree** para enviar el formulario de contacto
- **localStorage** para guardar los productos del administrador, el carrito, los usuarios registrados y la sesión
- **sessionStorage** para el saludo que sale una sola vez después de iniciar sesión
- **Video MP4** en el pop-up de bienvenida del inicio
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
    ├── assets/
    │   ├── imagenes/           → imágenes por página y fotos de los kits (img_json/)
    │   └── video/              → video del pop-up de bienvenida y su imagen de portada
    ├── components/             → piezas que se repiten
    │   ├── header/             → menú, carrito y usuario con sesión
    │   ├── footer/
    │   └── home-pages/
    │       ├── Banner_home/    → banner del inicio
    │       ├── carrusel/       → kits destacados
    │       ├── funcionamiento/ → "¿Cómo funciona?"
    │       ├── bienvenida/     → pop-up de bienvenida con video
    │       └── papel-relleno/  → papelitos que caen detrás del contenido (se usa en varias páginas)
    ├── css/
    │   └── global.css          → paleta, fuente y reset compartidos
    ├── data/
    │   └── productos.json      → catálogo de productos
    ├── js/
    │   ├── components.js       → carga el header, el footer, los componentes y el papel de relleno
    │   └── sesion.js           → guardar, leer y cerrar la sesión del usuario
    ├── registro/               → crear cuenta
    └── tienda/
        ├── admin/              → panel de administrador
        ├── carrito/            → carrito de compras
        ├── catalogo/           → catálogo de kits
        ├── contacto/           → formulario de contacto
        ├── login/              → iniciar sesión
        └── nosotros/           → quiénes somos
```

---

## 📄 Páginas

| Página | Qué tiene | Estado |
|---|---|---|
| **Inicio** | Pop-up de bienvenida con video, banner, carrusel con los kits destacados (los lee del JSON), sección "cómo funciona" y papel de relleno | ✅ Lista |
| **Nosotros** | Problema, misión, visión, valores y equipo, con animación al hacer scroll y papel de relleno | ✅ Lista |
| **Contacto** | Formulario con validación en JavaScript (regex), envío con Formspree, mapa, información de contacto y papel de relleno | ✅ Lista |
| **Catálogo** | Tarjetas de los kits cargadas desde el JSON, categorías, buscador, filtros (ordenar por precio o nombre, solo con stock) y papel de relleno | ✅ Lista |
| **Carrito** | Kits agregados, botones + y −, eliminar, total y papel de relleno. Falta la lista del resumen y el botón "Realizar pedido" | 🚧 En progreso |
| **Crear cuenta** | Formulario de registro con validaciones; guarda el usuario en localStorage | ✅ Lista |
| **Iniciar sesión** | Valida correo y contraseña contra los usuarios registrados y abre la sesión | ✅ Lista |
| **Administrador** | Formulario para agregar productos y tabla con los productos | 🚧 En progreso |

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
  "imagen": "src/assets/imagenes/img_json/01_Kit_de_Herramientas/herr_01.jpg",
  "stock": 10,
  "categoria": "Kit de Herramientas",
  "destacado": false
}
```

Por ahora hay 12 productos en 3 categorías: Herramientas, Arte y Mascotas.

Las rutas de las imágenes en el JSON empiezan por `src/`. Cada página las convierte para que funcionen desde su carpeta: por ejemplo, el catálogo y el admin cambian `src/` por `../../`.

El JSON se usa en tres lugares:
- **Carrusel del inicio:** muestra solo los productos con `"destacado": true`
- **Catálogo:** muestra todos los productos en tarjetas
- **Administrador:** muestra los productos en la tabla

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

### Usuarios y sesión

Todo se guarda en el navegador con localStorage:

| Clave | Qué guarda | Quién la usa |
|---|---|---|
| `kitbox_usuarios` | Lista de usuarios registrados | Crear cuenta (`ResgistoLocalStorage.js`) e Iniciar sesión |
| `kitbox_sesion` | Quién tiene la sesión abierta: nombre, correo y fecha. **Nunca la contraseña** | `js/sesion.js` |
| `kitbox_carrito` | Kits del carrito con su cantidad | Catálogo y carrito |

Las funciones de la sesión (`guardarSesion`, `obtenerSesion`, `cerrarSesion`...) están en **`src/js/sesion.js`**, porque las usan el login y el header en todas las páginas.

Cuando hay alguien con la sesión abierta:
- El header cambia el botón "Iniciar Sesión" por las **iniciales** y **"Hola, Nombre"** (en celular solo las iniciales).
- Al hacerle clic se abre un menú con el nombre, el correo y **"Cerrar sesión"**. Se cierra con Esc o con un clic afuera.
- Justo después de iniciar sesión sale el aviso **"¡Qué bueno verte, Nombre!"** una sola vez, y al cerrar sesión sale **"Cerraste sesión. ¡Vuelve pronto, Nombre!"**.

> ⚠️ **Si creas una página nueva con header**, carga `sesion.js` **antes** de `components.js`:
> ```html
> <script src="../../js/sesion.js"></script>
> <script src="../../js/components.js"></script>
> ```
> Si no, el header funciona pero no muestra al usuario (en la consola sale un aviso).

### Pop-up de bienvenida (`components/home-pages/bienvenida/`)

- Usa el **modal de Bootstrap** y se abre cada vez que se carga el inicio.
- El video arranca solo y **en silencio** (los navegadores no dejan arrancar con sonido) y tiene un botón para activar el sonido.
- Sin sesión dice **"¡Bienvenido a Kit-Box!"** y con sesión **"¡Bienvenido a Kit-Box, Nombre!"**.
- Al cerrarlo (X, Esc, clic afuera o "Empezar") el video se detiene.
- Si la persona activó "reducir movimiento", el video no arranca solo.

### Papel de relleno (`components/home-pages/papel-relleno/`)

Papelitos kraft, como el relleno de una caja de regalo, que caen despacio detrás del contenido. Es solo decoración: no bloquean clics y desaparecen si la persona activó "reducir movimiento".

Para ponerlo en una página basta con agregar el atributo `data-papel-relleno` (la cantidad de papelitos) al elemento donde deben caer:

```html
<main class="login-pagina" data-papel-relleno="16">
```

`components.js` lo detecta y carga solo el CSS y el JS. Opcional: `data-papel-velocidad="60"` (píxeles por segundo; si no se pone, usa 60).

Hoy está en Inicio, Nosotros, Contacto, Catálogo, Iniciar sesión, Crear cuenta y Carrito. En el inicio se llama desde `components.js` después de cargar el carrusel, porque el carrusel reemplaza el contenido de su contenedor.

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
- Los textos que escribe el usuario (nombres, correos) se ponen en la página con `textContent`, **nunca con `innerHTML`**, para que nadie pueda meter código.
- Las páginas con header cargan `js/sesion.js` antes de `js/components.js`.
- Para decorar una sección con papel de relleno se usa `data-papel-relleno="cantidad"` en el HTML, sin agregar JS.
