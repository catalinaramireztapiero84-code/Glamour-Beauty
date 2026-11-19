// GLAMOUR BEAUTY - APLICACIÓN WEB CRUD
const formulario = document.getElementById("formularioProducto");
const listaProductos = document.getElementById("listaProductos");
const productoId = document.getElementById("productoId");
const nombre = document.getElementById("nombre");
const categoria = document.getElementById("categoria");
const precio = document.getElementById("precio");
const cantidad = document.getElementById("cantidad");
const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");

const productosIniciales = [
  {id:"1",nombre:"Labial Rosado",categoria:"Labiales",precio:25000,cantidad:15},
  {id:"2",nombre:"Base Líquida",categoria:"Bases",precio:45000,cantidad:10},
  {id:"3",nombre:"Rubor Pink",categoria:"Rubores",precio:30000,cantidad:12},
  {id:"4",nombre:"Pestañina Volumen",categoria:"Pestañinas",precio:28000,cantidad:20},
  {id:"5",nombre:"Polvo Compacto",categoria:"Polvos",precio:35000,cantidad:8},
  {id:"6",nombre:"Paleta de Sombras",categoria:"Sombras",precio:55000,cantidad:6}
];


const imagenes = {
  Labiales: "labiales.jpg",
  Bases: "bases.jpg",
  Polvos: "polvos.jpg",
  Pestañinas: "pestaninas.jpg",
  Rubores: "rubores.jpg",
  Sombras: "sombras.jpg",
  Correctores: "correctores.jpg"
};


function cargarProductos(){
  const guardados=localStorage.getItem("productosGlamour");
  if(guardados===null){
    localStorage.setItem("productosGlamour",JSON.stringify(productosIniciales));
    return [...productosIniciales];
  }
  try{
    const datos=JSON.parse(guardados);
    return Array.isArray(datos)?datos:[...productosIniciales];
  }catch(error){
    console.error("No se pudieron leer los productos guardados:",error);
    return [...productosIniciales];
  }
}
let productos=cargarProductos();

function guardarEnAlmacenamiento(){
  localStorage.setItem("productosGlamour",JSON.stringify(productos));
}

function mostrarProductos(){
  listaProductos.replaceChildren();
  if(productos.length===0){
    const mensaje=document.createElement("p");
    mensaje.className="vacio";
    mensaje.textContent="No hay productos registrados. ¡Agrega el primero! 💗";
    listaProductos.appendChild(mensaje);
    return;
  }

  productos.forEach(producto=>{
    const tarjeta=document.createElement("article");
    tarjeta.className="tarjeta";

    const imagen=document.createElement("img");
    imagen.className="producto-imagen";
    imagen.src=imagenes[producto.categoria]||imagenes.Labiales;
    imagen.alt=producto.nombre;

    const titulo=document.createElement("h3");
    titulo.textContent=producto.nombre;
    const tipo=document.createElement("p");
    tipo.textContent="Categoría: "+producto.categoria;
    const valor=document.createElement("p");
    valor.className="precio";
    valor.textContent="$"+Number(producto.precio).toLocaleString("es-CO")+" COP";
    const unidades=document.createElement("p");
    unidades.textContent="Cantidad disponible: "+producto.cantidad;

    const acciones=document.createElement("div");
    acciones.className="acciones";
    const editar=document.createElement("button");
    editar.className="btn-editar";
    editar.textContent="Editar";
    editar.addEventListener("click",()=>editarProducto(producto.id));
    const eliminar=document.createElement("button");
    eliminar.className="btn-eliminar";
    eliminar.textContent="Eliminar";
    eliminar.addEventListener("click",()=>eliminarProducto(producto.id));

    acciones.append(editar,eliminar);
    tarjeta.append(imagen,titulo,tipo,valor,unidades,acciones);
    listaProductos.appendChild(tarjeta);
  });
}

formulario.addEventListener("submit",evento=>{
  evento.preventDefault();
  const nuevoProducto={
    id:productoId.value||Date.now().toString(),
    nombre:nombre.value.trim(),
    categoria:categoria.value,
    precio:Number(precio.value),
    cantidad:Number(cantidad.value)
  };

  if(!nuevoProducto.nombre||!nuevoProducto.categoria||
     !Number.isInteger(nuevoProducto.precio)||nuevoProducto.precio<=0||
     !Number.isInteger(nuevoProducto.cantidad)||nuevoProducto.cantidad<0){
    alert("Por favor, ingresa datos válidos.");
    return;
  }

  if(productoId.value){
    const posicion=productos.findIndex(p=>p.id===productoId.value);
    if(posicion!==-1){
      productos[posicion]=nuevoProducto;
      alert("¡Producto actualizado correctamente! 💗");
    }
  }else{
    productos.push(nuevoProducto);
    alert("¡Producto agregado correctamente! 💄");
  }
  guardarEnAlmacenamiento();
  mostrarProductos();
  limpiarFormulario();
});

function editarProducto(id){
  const producto=productos.find(p=>p.id===id);
  if(!producto)return;
  productoId.value=producto.id;
  nombre.value=producto.nombre;
  categoria.value=producto.categoria;
  precio.value=producto.precio;
  cantidad.value=producto.cantidad;
  btnGuardar.textContent="Guardar cambios";
  btnCancelar.hidden=false;
  document.getElementById("administrar").scrollIntoView({behavior:"smooth"});
}

function eliminarProducto(id){
  if(!confirm("¿Estás segura de que deseas eliminar este producto?"))return;
  productos=productos.filter(p=>p.id!==id);
  guardarEnAlmacenamiento();
  mostrarProductos();
  alert("Producto eliminado correctamente.");
}

function limpiarFormulario(){
  formulario.reset();
  productoId.value="";
  btnGuardar.textContent="＋ Agregar producto";
  btnCancelar.hidden=true;
}
btnCancelar.addEventListener("click",limpiarFormulario);
mostrarProductos();
