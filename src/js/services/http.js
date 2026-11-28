import { construirUrlApi } from "../config/api.js";

export class ApiError extends Error {
    constructor(message, { status = 0, data = null, url = "" } = {}) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.data = data;
        this.url = url;
    }
}

function obtenerToken() {
    return localStorage.getItem("kitbox_token");
}

function construirHeaders(headersPersonalizados = {}, body) {
    const headers = new Headers(headersPersonalizados);
    const token = obtenerToken();

    if (body !== undefined && body !== null && !(body instanceof FormData)) {
        headers.set("Content-Type", "application/json");
    }

    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
}

async function leerRespuesta(response, url) {
    const tipoContenido = response.headers.get("content-type") || "";
    let data = null;

    if (response.status !== 204) {
        if (tipoContenido.includes("application/json")) {
            data = await response.json();
        } else {
            data = await response.text();
        }
    }

    if (!response.ok) {
        const mensaje = typeof data === "string"
            ? data
            : data?.message || data?.error || `Error HTTP ${response.status}`;

        throw new ApiError(mensaje, {
            status: response.status,
            data,
            url
        });
    }

    return data;
}

/**
 * Ejecuta una petición HTTP contra la API de KitBox.
 *
 * `body` puede ser un objeto JavaScript, que se serializa como JSON, o un
 * FormData, que se envía directamente sin forzar Content-Type.
 */
export async function request(endpoint, {
    method = "GET",
    body,
    headers,
    credentials = "include",
    ...options
} = {}) {
    const url = construirUrlApi(endpoint);
    const esFormData = body instanceof FormData;
    const bodyPreparado = body === undefined || body === null || esFormData
        ? body
        : JSON.stringify(body);

    try {
        const response = await fetch(url, {
            method,
            headers: construirHeaders(headers, body),
            body: bodyPreparado,
            credentials,
            ...options
        });

        return await leerRespuesta(response, url);
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }

        throw new ApiError(
            "No se pudo conectar con el servidor. Verifica tu conexión e inténtalo nuevamente.",
            { url, data: error }
        );
    }
}

export function get(endpoint, options = {}) {
    return request(endpoint, { ...options, method: "GET" });
}

export function post(endpoint, body, options = {}) {
    return request(endpoint, { ...options, method: "POST", body });
}

export function put(endpoint, body, options = {}) {
    return request(endpoint, { ...options, method: "PUT", body });
}

export function patch(endpoint, body, options = {}) {
    return request(endpoint, { ...options, method: "PATCH", body });
}

export function del(endpoint, options = {}) {
    return request(endpoint, { ...options, method: "DELETE" });
}
