const botonCrearPedido = document.getElementById("boton-realizar-pedido");

botonCrearPedido.addEventListener("click", () => {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  if (carrito.length === 0) {
    alert("El carrito está vacío. Agrega productos antes de realizar el pedido.");
    return;
  }

  // Aquí puedes agregar la lógica para crear el pedido, como enviar los datos al servidor
  // Por ejemplo, podrías hacer una solicitud fetch para enviar el carrito al backend