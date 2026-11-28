const API_URL_PRODUCTOS = "http://localhost:8080/api/productos";

/**
 * Obtiene los productos vigentes desde el backend.
 * El backend actual responde con { content: [...] }, pero se acepta también
 * un arreglo directo para mantener el servicio tolerante al formato REST.
 */
export async function obtenerProductos() {
    const respuesta = await fetch(API_URL_PRODUCTOS);

    if (!respuesta.ok) {
        throw new Error(`Error HTTP ${respuesta.status}`);
    }

    const cuerpo = await respuesta.json();
    const productos = Array.isArray(cuerpo) ? cuerpo : cuerpo?.content;

    if (!Array.isArray(productos)) {
        throw new Error("La respuesta del backend no contiene una lista de productos");
    }

    return productos;
}

export async function cargarProductos() {
    return obtenerProductos();
}

// export async function crearProducto(producto, token) {
//     const respuesta = await fetch(API_URL_PRODUCTOS, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             ...(token ? { Authorization: `Bearer ${token}` } : {})
//         },
//         body: JSON.stringify(producto)
//     });

//     if (!respuesta.ok) {
//         throw new Error(`Error HTTP ${respuesta.status}`);
//     }

//     return respuesta.json();
// }


// -------------- nueva funcion
export async function agregarProducto(producto) {

const kitbox_token = localStorage.getItem("kitbox_token");  // mirar si es necesario ************************

        // producto.id=generarID(producto);
        // productos.push(producto)
        // guardarProductos(productos);
        // console.log(JSON.stringify(productos, null, 2));

        try {
            const response = await fetch (API_URL_PRODUCTOS, {
                method: "POST",
                headers: {"Content-Type": "application/json", "Authorization": `Bearer ${kitbox_token}`},
                body: JSON.stringify(producto)
            });

            if(!response.ok){
                throw new Error(`Error HTTP: ${response.status}`);

            }
            const result = await response.json();
            
            return result; // Devolvemos el producto creado para que quien llama pueda usarlo si lo necesita
        } catch (error) {
            console.error(`Error creando producto ${error.message}`)
            throw error; // para que quien llama sepa que falló

        }
}




export async function eliminarProductoAPI(id, token){

    const response = await fetch (`${API_URL_PRODUCTOS}/${id}`, {
        method: "DELETE",
        headers: {"Authorization": ` Bearer ${token}`}
        });

        if (!response.ok) {
        throw new Error(`Error HTTP ${respuesta.status}`);
    }
}



