const CLAVE = "kitbox_productos";

export function guardarProductos(productos) {
  localStorage.setItem(CLAVE, JSON.stringify(productos));
}

export function obtenerProductosGuardados() {
  const texto = localStorage.getItem(CLAVE);

  if (texto === null) {
    return null;
  }

  try {
    return JSON.parse(texto);
  } catch (error) {
    console.log("Los datos guardados están dañados", error);
    return null;
  }
}