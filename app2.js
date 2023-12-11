const readline = require('readline');
const fs = require('fs');
require('colors');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

class Producto {
  #codigoProducto;
  #nombreProducto;
  #inventarioProducto;
  #precioProducto;

  constructor() {
    this.#codigoProducto = '';
    this.#inventarioProducto = '';
    this.#nombreProducto = '';
    this.#precioProducto = 0;
  }

  setCodigoProducto(value) {
    this.#codigoProducto = value;
  }

  getCodigoProducto() {
    return this.#codigoProducto;
  }

  setInventarioProducto(value) {
    this.#inventarioProducto = value;
  }

  getInventarioProducto() {
    return this.#inventarioProducto;
  }

  setNombreProducto(value) {
    this.#nombreProducto = value;
  }

  getNombreProducto() {
    return this.#nombreProducto;
  }

  setPrecioProducto(value) {
    this.#precioProducto = value;
  }

  getPrecioProducto() {
    return this.#precioProducto;
  }
}

class ProductosTienda {
  #listaProducto;

  constructor() {
    this.#listaProducto = [];
  }

  getListaProductos() {
    return this.#listaProducto;
  }

  agregarProducto(producto) {
    this.#listaProducto.push(producto);
    this.grabarArchivoProductos();
  }

  cargarArchivosProductos() {
    try {
      const data = fs.readFileSync('datos.json', 'utf8');
      const datosArchivo = JSON.parse(data);
      let contador = 0;

      datosArchivo.forEach(objeto => {
        contador++;

        let producto = new Producto();
        producto.setCodigoProducto(objeto.codigoProducto);
        producto.setNombreProducto(objeto.nombreProducto);
        producto.setInventarioProducto(objeto.inventarioProducto);
        producto.setPrecioProducto(objeto.precioProducto);

        this.#listaProducto.push(producto);
      });

      console.log(`Total de productos cargados: ${contador}`.bgYellow.black);
    } catch (error) {
      console.error(`Error al cargar archivos: ${error.message}`.bgRed.white);
    }
  }

  grabarArchivoProductos() {
    const instanciaClaseAObjetos = this.#listaProducto.map(producto => {
      return {
        codigoProducto: producto.getCodigoProducto(),
        nombreProducto: producto.getNombreProducto(),
        inventarioProducto: producto.getInventarioProducto(),
        precioProducto: producto.getPrecioProducto()
      };
    });

    const cadenaJson = JSON.stringify(instanciaClaseAObjetos, null, 2);
    const nombreArchivo = 'datos.json';

    try {
      fs.writeFileSync(nombreArchivo, cadenaJson, 'UTF-8');
      console.log(`DATOS GUARDADOS EN ${nombreArchivo}`.green);
    } catch (error) {
      console.error(`Error al grabar archivo: ${error.message}`.bgRed.white);
    }
  }

  mostrarProductos() {
    this.#listaProducto.forEach(producto => {
      console.log(`| ${producto.getCodigoProducto()} | ${producto.getNombreProducto()} | ${producto.getInventarioProducto()} | ${producto.getPrecioProducto()} |`);
    });
  }
}


class TiendaCBA {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    this.cliente = {
      nombre: '',
      documento: '',
      direccion: ''
    };

    this.productos = [];
    this.carrito = [];
  }

  questionSync(prompt) {
    return this.rl.question(prompt);
  }

  comprarProductos() {
    if (!this.cliente.nombre) {
      this.cliente.nombre = this.questionSync("Ingrese su nombre: ");
      this.cliente.documento = this.questionSync("Ingrese su documento: ");
      this.cliente.direccion = this.questionSync("Ingrese su dirección: ");
    }
  
    let intentos = 0;
    const maxIntentos = 3; 
  
    while (true) {
      console.log("Lista de productos disponibles:");
      this.productos.forEach((producto, index) => {
        console.log(`${index}. ${producto.nombre} - $${producto.precio} - Unidades: ${producto.unidades}`);
      });
  
      let input = this.questionSync("Ingrese el índice del producto a comprar (o 'f' para finalizar): ");
      if (input === 'f') {
        break;
      }
  
      let index = parseInt(input);
      if (!isNaN(index) && index >= 0 && index < this.productos.length) {
        const productoComprado = this.productos[index];
        let cantidad = parseInt(this.questionSync(`Ingrese la cantidad de unidades a comprar (disponibles: ${productoComprado.unidades}): `));
  
        if (!isNaN(cantidad) && cantidad > 0 && cantidad <= productoComprado.unidades) {
          productoComprado.unidades -= cantidad;
          this.carrito.push({ producto: productoComprado, cantidad });
  
          console.log(`Ha agregado ${cantidad} unidades de ${productoComprado.nombre} al carrito.`);
        } else {
          console.log("Cantidad inválida o insuficiente.");
          intentos++;
        }
  
        if (intentos >= maxIntentos) {
          console.log("Demasiados intentos fallidos. Saliendo del proceso de compra.");
          break;
        }
      } else {
        console.log("Índice inválido.");
        intentos++;
      }
    }
  }
  

  generarFactura() {
    console.log("===============================");
    console.log("          FACTURA");
    console.log("===============================");
    console.log("Cliente:");
    console.log(`Nombre: ${this.cliente.nombre}`);
    console.log(`Documento: ${this.cliente.documento}`);
    console.log(`Dirección: ${this.cliente.direccion}`);
    console.log("Productos en el Carrito:");

    let total = 0;

    this.carrito.forEach((item, index) => {
      const { producto, cantidad } = item;
      const subtotal = producto.precio * cantidad;
      total += subtotal;

      console.log(`[${index + 1}] ${producto.nombre} - $${producto.precio} x ${cantidad} unidades = $${subtotal}`);
    });

    console.log("===============================");
    console.log(`Total: $${total}`);
    console.log("===============================");

    this.carrito = [];
  }

  cerrarApp() {
    console.log("¡Gracias por usar la tienda CBA!");
    this.rl.close();
  }
}

const tienda = new TiendaCBA();

function mostrarProductosDesdeConsola() {
  productosTienda.mostrarProductos();
  mostrarMenu();
}

function copiaDeRespaldo() {
  console.log('*****************************************'.red);
  console.log('* DATOS DE RESPALDO **'.red);
  console.log('*****************************************\n'.red);

  rl.question('1. Ingrese el NOMBRE de la copia de respaldo : ', (nombreCopia) => {
    const rutaOriginal = 'datos.json';
    const rutaCopia = `${nombreCopia}.json`;

    try {
      fs.copyFileSync(rutaOriginal, rutaCopia);
      console.log(`Copia de respaldo realizada correctamente: ${rutaCopia}`.green);
    } catch (error) {
      console.error(`Error al hacer la copia de respaldo: ${error.message}`.bgRed.white);
    }

    mostrarMenu();
  });
}

function ReparacionDatos() {
  rl.question('1. Nombre del archivo a copiar : ', (archivo) => {
    rl.question('2. Nombre del nuevo archivo : ', (nuevo) => {
      const rutaOriginal = `${archivo}.json`;
      const rutaCopia = `${nuevo}.json`;

      try {
        fs.copyFileSync(rutaOriginal, rutaCopia);
        console.log(`Copia de respaldo realizada correctamente: ${rutaCopia}`.green);
      } catch (error) {
        console.error(`Error al hacer la copia de respaldo: ${error.message}`.bgRed.white);
      }

      mostrarMenu();
    });
  });
}

function borrarProductoInventario() {
  console.clear();
  console.log('**************************************'.yellow);
  console.log('* BORRAR PRODUCTO **'.yellow);
  console.log('**************************************\n'.yellow);
  productosTienda.mostrarProductos();

  rl.question('Ingrese el código de producto a borrar: ', (codigo) => {
    const productos = productosTienda.getListaProductos();
    const indiceProductoABorrar = productos.findIndex(producto => producto.getCodigoProducto() === codigo);

    if (indiceProductoABorrar !== -1) {
      productos.splice(indiceProductoABorrar, 1);
      productosTienda.grabarArchivoProductos();
      console.clear();
      console.log('Producto borrado exitosamente.'.bgGreen.black);
    } else {
      console.clear();
      console.log('No se encontró un producto con ese código.'.bgRed.white);
    }

    mostrarMenu();
  });
}

function agregarProductoDesdeConsola() {
    console.clear();
    console.log('*****************************************'.green);
    console.log('* AGREGAR PRODUCTOS **'.green);
    console.log('*****************************************\n'.green);
  
    productosTienda.mostrarProductos();
  
    rl.question('Ingrese el código del producto: ', (codigo) => {
      rl.question('Ingrese el nombre del producto: ', (nombre) => {
        rl.question('Ingrese el inventario del producto: ', (inventario) => {
          rl.question('Ingrese el precio del producto: ', (precio) => {
            const nuevoProducto = new Producto();
            nuevoProducto.setCodigoProducto(codigo);
            nuevoProducto.setNombreProducto(nombre);
            nuevoProducto.setInventarioProducto(inventario);
            nuevoProducto.setPrecioProducto(precio);
  
            productosTienda.agregarProducto(nuevoProducto);
            console.clear();
            console.log('Producto agregado exitosamente.'.bgGreen.black);
  
            // Llamamos a mostrarMenu solo después de agregar el producto
            mostrarMenu();
          });
        });
      });
    });
  }
  
function mostrarMenu() {
  console.log(`==============================`.blue);
  console.log(`==        TIENDA CBA        ==`.blue);
  console.log(`==============================\n`.blue);
  console.log(`==============================`.blue);
  console.log(`= 1. Cargar Datos            =`);
  console.log(`= 2. Copia de Respaldo       =`);
  console.log(`= 3. Reparar Datos           =`);
  console.log(`= 4. Grabar Nuevos Productos =`);
  console.log(`= 5. Borrar Producto         =`);
  console.log(`= 6. Comprar Productos       =`);
  console.log(`= 7. Imprimir Factura        =`);
  console.log(`= 0. Cerrar App              =`);
  console.log(`==============================\n`.blue);

  rl.question(`Seleccione una opción: `, (opcion) => {
    switch (opcion) {
      case '1':
        console.clear();
        console.log(`========================================`.blue);
        console.log(`==    Total de productos a la Venta   ==`.blue);
        console.log(`========================================`.blue);
        productosTienda.mostrarProductos();
        console.log(`========================================\n`.blue);
        mostrarMenu();
        break;
      case '2':
        console.clear();
        console.log('*****************************************'.red);
        console.log('* COPIA DE RESPALDO **'.red);
        console.log('*****************************************'.red);
        copiaDeRespaldo();
        break;
      case '3':
        console.clear();
        console.log('**************************************'.yellow);
        console.log('* REPARAR DATOS **'.yellow);
        console.log('**************************************\n'.yellow);
        ReparacionDatos();
        break;
      case '4':
        agregarProductoDesdeConsola();
        break;
      case '5':
        borrarProductoInventario();
        break;
      case '6':
        tienda.comprarProductos();
        break;
      case '7':
        tienda.generarFactura();
        break;
      case '0':
        tienda.cerrarApp();
        break;
      default:
        console.log('Opción no válida. Por favor, seleccione una opción válida.'.bgRed.white);
        mostrarMenu();
        break;
    }
  });
}

function Limpiar() {
  console.clear();
  mostrarMenu();
}
let productosTienda = new ProductosTienda();
function main() {
  console.clear();
  
  productosTienda.cargarArchivosProductos();
  mostrarMenu();
}

main();
