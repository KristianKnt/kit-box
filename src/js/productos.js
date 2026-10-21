
export const productos=[];

export async function cargarProductosIniciales(params) {
    try {
        const respuesta = await fetch("../../data/productos.json"); //peticion a json
        const datos= await respuesta.json(); // traemos la resupuesta y la pasamos  a objeto JS
        productos.push(...datos);//agregamos a la lista de productos
        console.log(JSON.stringify(productos,null,2)); //imprimimos en formato JSON la lista. Sin filtros y con dos espacios de sangria
        
    } catch (error) {
        console.log("No se pudo cargar productos.json",error); //
        
    }
}

export async function agregarProducto(producto) {
        producto.id="prod_" + Date.now();
        productos.push(producto)
}
