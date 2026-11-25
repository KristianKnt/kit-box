
// import { guardarProductos, obtenerProductosGuardados } from "./storage.js";
import {cargarProductos} from "../catalogo/catalogo.js"

export const productos=[];

export async function cargarProductosIniciales() {

    /*if(productosGuardados!==null){
        productos.push(...productosGuardados);
               console.log(JSON.stringify(productos, null, 2));
        return
    }*/

    try {

        const productosGuardados= await cargarProductos(); //obtenemos del local los productoe que se han guardado antes

        // const respuesta = await fetch("../../data/productos.json"); //peticion a json
        // const datos= await respuesta.json(); // traemos la resupuesta y la pasamos  a objeto JS
        // productos.push(...datos);//agregamos a la lista de productos
        // console.log(JSON.stringify(productos,null,2)); //imprimimos en formato JSON la lista. Sin filtros y con dos espacios de sangria
        
        productos.push(...productosGuardados);//agregamos a la lista de productos

    } catch (error) {
        console.log("No se pudieron cargar los productos de la base de datos desde admin",error); 
        
    }
}
const api_URL_productos = 'http://localhost:8080/api/productos'

export async function agregarProducto(producto) {

const kitbox_token = localStorage.getItem("kitbox_token");  // mirar si es necesario ************************

        // producto.id=generarID(producto);
        // productos.push(producto)
        // guardarProductos(productos);
        // console.log(JSON.stringify(productos, null, 2));

        try {
            const response = await fetch (api_URL_productos, {
                method: "POST",
                headers: {"Content-Type": "application/json", "Authorization": `Bearer ${kitbox_token}`},
                body: JSON.stringify(producto)
            });

            if(!response.ok){
                throw new Error(`Error HTTP: ${response.status}`);

            }
            return await response.json();

        } catch (error) {
            console.error(`Error creando producto ${error.message}`)
            throw error; // para que quien llama sepa que falló

        }
}

export function eliminarProducto(id){
    const indexBuscar=productos.findIndex((producto)=> producto.id===id);
    if(indexBuscar !== -1){
        productos.splice(indexBuscar,1);
        guardarProductos(productos);
    }
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