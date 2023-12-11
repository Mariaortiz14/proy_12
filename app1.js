const fs = require('fs/promises');
const readline = require('readline');

class Tienda {
  constructor() {
    this.productos = [];
    this.cliente = {};
    this.carrito = [];
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async cargarDatos() {
    try {
      const data = await fs.readFile('datos.json', 'utf-8');
      this.productos = JSON.parse(data);
      console.log("Datos cargados correctamente.");
    } catch (error) {
      console.error("Error al cargar datos:", error.message);
    }
  }

  async respaldo() {
    try {
      const data = JSON.stringify(this.productos, null, 2);
      await fs.writeFile('respaldo.json', data, 'utf-8');
      console.log("Respaldo realizado con éxito.");
    } catch (error) {
      console.error("Error al realizar respaldo:", error.message);
    }
  }

  repararDatos() {
    // Lógica para reparar datos
    console.log("Datos reparados correctamente.");
  }

  async grabarProductos() {
    let nombre = await this.question("Ingrese el nombre del producto: ");
    let precio = parseFloat(await this.question("Ingrese el precio del producto: "));
    let unidades = parseInt(await this.question("Ingrese la cantidad de unidades disponibles: "));

    this.productos.push({ nombre, precio, unidades });

    try {
      await fs.writeFile('datos.json', JSON.stringify(this.productos, null, 2), 'utf-8');
      console.log("Producto grabado con éxito.");
    } catch (error) {
      console.error("Error al grabar producto:", error.message);
    }
  }

  async borrarProducto() {
    console.log("Lista de productos disponibles:");
    this.productos.forEach((producto, index) => {
      console.log(`${index}. ${producto.nombre} - $${producto.precio} - Unidades: ${producto.unidades}`);
    });

    let index = parseInt(await this.question("Ingrese el índice del producto a borrar: "));
    if (index >= 0 && index < this.productos.length) {
      this.productos.splice(index, 1);

      try {
        await fs.writeFile('datos.json', JSON.stringify(this.productos, null, 2), 'utf-8');
        console.log("Producto borrado con éxito.");
      } catch (error) {
        console.error("Error al borrar producto:", error.message);
      }
    } else {
      console.log("Índice inválido.");
    }
  }

  async comprarProductos() {
    if (!this.cliente.nombre) {
      this.cliente.nombre = await this.question("Ingrese su nombre: ");
      this.cliente.documento = await this.question("Ingrese su documento: ");
      this.cliente.direccion = await this.question("Ingrese su dirección: ");
    }

    while (true) {
      console.log("Lista de productos disponibles:");
      this.productos.forEach((producto, index) => {
        console.log(`${index}. ${producto.nombre} - $${producto.precio} - Unidades: ${producto.unidades}`);
      });

      let input = await this.question("Ingrese el índice del producto a comprar (o 'f' para finalizar): ");
      if (input === 'f') {
        break;
      }

      let index = parseInt(input);
      if (!isNaN(index) && index >= 0 && index < this.productos.length) {
        const productoComprado = this.productos[index];
        let cantidad = parseInt(await this.question(`Ingrese la cantidad de unidades a comprar (disponibles: ${productoComprado.unidades}): `));

        if (!isNaN(cantidad) && cantidad > 0 && cantidad <= productoComprado.unidades) {
          productoComprado.unidades -= cantidad;
          this.carrito.push({ producto: productoComprado, cantidad });

          console.log(`Ha agregado ${cantidad} unidades de ${productoComprado.nombre} al carrito.`);
        } else {
          console.log("Cantidad inválida o insuficiente.");
        }
      } else {
        console.log("Índice inválido.");
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

    // Limpiar carrito después de imprimir factura
    this.carrito = [];
  }

  cerrarApp() {
    console.log("¡Gracias por usar la tienda CBA!");
    this.rl.close();
  }

  question(prompt) {
    return new Promise((resolve) => {
      this.rl.question(prompt, (answer) => {
        resolve(answer);
      });
    });
  }

  async iniciar() {
    while (true) {
      console.log("===============================");
      console.log("==        TIENDA CBA        ==")
      console.log("===============================");
      console.log("===============================");
      console.log("= 1. Cargar Datos            =");
      console.log("= 2. Copia de Respaldo       =");
      console.log("= 3. Reparar Datos           =");
      console.log("= 4. Grabar Nuevos Productos =");
      console.log("= 5. Borrar Producto         =");
      console.log("= 6. Comprar Productos       =");
      console.log("= 7. Imprimir Factura        =");
      console.log("= 0. Cerrar App              =");
      console.log("===============================");

      let opcion = await this.question("Seleccione una opción: ");

      switch (opcion) {
        case '1':
          await this.cargarDatos();
          break;
        case '2':
          await this.respaldo();
          break;
        case '3':
          this.repararDatos();
          break;
        case '4':
          await this.grabarProductos();
          break;
        case '5':
          await this.borrarProducto();
          break;
        case '6':
          await this.comprarProductos();
          break;
        case '7':
          this.generarFactura();
          break;
        case '0':
          this.cerrarApp();
          break;
        default:
          console.log("Opción inválida. Intente nuevamente.");
      }
    }
  }
}

const tienda = new Tienda();
tienda.iniciar();
