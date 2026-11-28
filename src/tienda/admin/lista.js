
import { cargarProductos,eliminarProductoAPI } from "../servicios/productos.js";
import { pintarProductos } from "./tabla.js"

export const productos=[];

export async function cargarProductosIniciales() {

    /*if(productosGuardados!==null){
        productos.push(...productosGuardados);
               console.log(JSON.stringify(productos, null, 2));
        return
    }*/

    try {

        const productosGuardados= await cargarProductos(); //obtenemos del local los productoe que se han guardado antes

        productos.push(...productosGuardados);//agregamos a la lista de productos

    } catch (error) {
        console.log("No se pudieron cargar los productos de la base de datos desde admin",error); 
        
    }
}



export async function eliminarProducto(id){

const kitbox_token = localStorage.getItem("kitbox_token"); 

    await eliminarProductoAPI (id, kitbox_token)
    console.log(id,productos)
    const indexBuscar=productos.findIndex((producto)=> producto.id===id);
    if(indexBuscar !== -1){
        productos.splice(indexBuscar,1);
        // guardarProductos(productos);
    
    }

    productos.length=0
    await cargarProductosIniciales();
}

//manejo id
/* const prefijosID={

    "Kit de Herramientas": "herr",
    "Kit de Arte": "arte",
    "Kit de Mascotas": "masc",
    "Kit de Bienestar": "bien",
    "Kit de Cocina": "coci",
    "Kit Deportivo": "depo",
    "Kit de Papelería": "pape",
    "Kit de Tecnología": "tecn",
    "Kit de Jardinería": "jard"};

function generarID (producto){
const categoria =producto.categoria;

const prefijo=prefijosID[categoria];
if(prefijo===undefined){
   return "prod_" + Date.now()
}
const prefijoArmado=prefijo+"_";
let numPrefijo=1;

while(productos.some((producto)=>producto.id===prefijoArmado + String(numPrefijo).padStart(2, "0"))){
    numPrefijo++;
}
return prefijoArmado + String(numPrefijo).padStart(2, "0");

}*/
