export function pintarProductos(productos){
    const contenedorProductos = document.getElementById("lista-productos"); //traemos la lista del DOM
    let filas="";
    for (const producto of productos){
        
        // Convertimos la ruta del JSON en una ruta relativa desde admin.html
        const rutaImagen = producto.imagen.replace(/^src\//, "../../");

        filas+= `
            <tr>
                <td><img
                        src="${rutaImagen}"
                        alt="${producto.nombre}"
                        width="60"
                        onerror="console.error('No se pudo cargar la imagen:', this.src)"
                    >
                </td>
                <td>${producto.nombre}</td>
                <td>${producto.categoria}</td>
                <td>$${producto.precio}</td>
                <td>${producto.stock}</td>
                <td>${producto.destacado ? "Sí" : "No"}</td>
            </tr>
        `;
    }

    contenedorProductos.innerHTML = `
        <h2 class="h4 mb-3">Productos</h2>
        <table class="table">
            <thead>
                <tr>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Destacado</th>
                </tr>
            </thead>
            <tbody>${filas}</tbody>
        </table>
    `;

}