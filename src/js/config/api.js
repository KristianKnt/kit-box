/**
 * Configuración central de la API de KitBox.
 *
 * El proyecto se ejecuta como JavaScript nativo en el navegador y no tiene
 * un bundler que reemplace variables como import.meta.env en tiempo de build.
 * Por eso se permite una configuración runtime opcional y se conserva un
 * valor por defecto para el despliegue actual.
 *
 * Para sobrescribirla antes de cargar los módulos de la aplicación:
 * globalThis.__KITBOX_CONFIG__ = {
 *   API_BASE_URL: "http://localhost:8080"
 * };
 */
const API_BASE_URL_POR_DEFECTO =
    "https://kit-box-backend-83b29.containers.snapdeploy.app";

const apiBaseUrlConfigurada = globalThis.__KITBOX_CONFIG__?.API_BASE_URL;

export const API_BASE_URL = (apiBaseUrlConfigurada || API_BASE_URL_POR_DEFECTO)
    .replace(/\/+$/, "");

export const API_ENDPOINTS = Object.freeze({
    productos: "/api/productos",
    clientes: "/api/cliente",
    login: "/auth/login",
    registro: "/auth/register"
});

export function construirUrlApi(endpoint) {
    const ruta = String(endpoint || "");
    return `${API_BASE_URL}/${ruta.replace(/^\/+/, "")}`;
}
