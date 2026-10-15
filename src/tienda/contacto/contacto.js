const nombre = "camila ";
const correo = "ju5544l@gmail.com";
const telefono = "3009785682";
const comentario = "hola este es mi comentario djskda djajjsja jssjsjs ajajsj"
const minComentario = 30;
const maxComentario = 3000;
/**reglas usando regex */
const reglaCorreo = /^[^\s@]+\@[^\s@]+\.[^\s@]+$/; /*regex \s espacio \@ apra el @ y \. para punto*/
const reglaTelefono = /^\d{10}$/; /*regex para digitos con inicio y fin */
let reglaComentario = false; /*bandera */
const reglaNomApe = /^[^\s@\d]+$/;


function validarComentario (comentario) {
   const numCaracteres = comentario.trim().length; /**quitamos espacios y nos devuelve numero de caracteres sin espacio*/
    if(numCaracteres < minComentario ){
        return false; /*El Mensaje es demasiado corto*/
    }
    else if (numCaracteres > maxComentario){
        return false;
    } else {
        return true;
    }
};


/*se combina con test para que devuelva un true o false */
console.log(reglaCorreo.test(correo));
console.log(reglaTelefono.test(telefono));
console.log(validarComentario (comentario));
console.log(reglaNomApe.test(nombre.trim()));

