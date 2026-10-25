    import { productos, cargarProductosIniciales, agregarProducto, eliminarProducto } from "./lista.js"  //se agrega productos
    import { pintarProductos } from "./tabla.js"    

    // Esperamos a que el HTML esté disponible.
    document.addEventListener("DOMContentLoaded", async () => {
        const formulario = document.getElementById("formulario-producto");

        if (!formulario) {
            console.error("No se encontró el formulario de productos.");
            return;
        }

        // Cargamos los productos iniciales.
        await cargarProductosIniciales();
        pintarProductos(productos);
        activarBotonEliminar();

        // Capturamos el envío del formulario.
        formulario.addEventListener("submit", (event) => {
            event.preventDefault();

            // Obtenemos los valores de los campos.
            const formData = new FormData(formulario);

            // Construimos el objeto producto.
            const producto = {
                nombre: formData.get("nombre").trim(),
                descripcion: formData.get("descripcion").trim(),
                precio: Number(formData.get("precio")),
                imagen: formData.get("imagen").trim(),
                stock: Number(formData.get("stock")),
                categoria: formData.get("categoria"),
                destacado: formData.get("destacado") === "true"
            };

            // Validación básica.
            if (
                !producto.nombre ||
                !producto.descripcion ||
                !producto.imagen ||
                !producto.categoria ||
                !Number.isFinite(producto.precio) ||
                producto.precio < 0 ||
                !Number.isInteger(producto.stock) ||
                producto.stock < 0
            ) {
                console.error("Revisa los datos del producto.");
                return;
            }

            // Agregamos el producto a la lista.
            agregarProducto(producto);
            pintarProductos(productos);
            activarBotonEliminar();



            // Limpiamos el formulario.
            formulario.reset();

            console.log("Producto agregado correctamente.");
        });
    });



function activarBotonEliminar(){
const botonesEliminar = document.querySelectorAll(".boton-eliminar");

botonesEliminar.forEach((boton)=>{
    boton.addEventListener("click",()=> {
        eliminarProducto(boton.dataset.id);
        pintarProductos(productos);
        activarBotonEliminar();

    } )
})
}


