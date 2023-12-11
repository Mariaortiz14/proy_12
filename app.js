// Importa el módulo 'fs' (File System) para trabajar con el sistema de archivos.
const fs = require('fs');

// Importa el paquete 'colors' para agregar colores a la salida en la consola.
require('colors');

// Definición de la 1er clase 'Producto'.
class Producto {
    // Constructor de la clase 'Producto' que inicializa las propiedades del producto.
    constructor(codigoProducto, nombreProducto, inventarioProducto, precioProducto) {
        this.codigoProducto = codigoProducto;         // Código único del producto.
        this.nombreProducto = nombreProducto;         // Nombre del producto.
        this.inventarioProducto = inventarioProducto; // Cantidad en inventario del producto.
        this.precioProducto = precioProducto;         // Precio del producto.
    }

    // Método estático que crea una instancia de la clase 'Producto' a partir de un objeto JSON.
    static fromJSON(json) {
        // Desestructura el objeto JSON para obtener sus propiedades.
        const { codigoProducto, nombreProducto, inventarioProducto, precioProducto } = json;
        
        // Crea y devuelve una nueva instancia de la clase 'Producto' con las propiedades proporcionadas.
        return new Producto(codigoProducto, nombreProducto, inventarioProducto, precioProducto);
    }
}

// Definición de la 2da clase 'ProductosTienda'.
class ProductosTienda {
    // Constructor de la clase.
    constructor() {
        // Inicializa la propiedad 'listaProductos' como un array vacío.
        this.listaProductos = [];
    }
    // Método para agregar un producto a la lista.
    agregarProducto(producto) {
        // Agrega el producto a la lista.
        this.listaProductos.push(producto);
    }

        // Método para mostrar la lista de productos en la consola.
    mostrarProductos() {
        // Muestra encabezado.
        console.clear();
        console.log("============= Lista de Productos ====================".yellow);
        // Verifica si la lista de productos está vacía.
        if (this.listaProductos.length === 0) {
             // Muestra un mensaje si la lista está vacía
            console.log("CARGUE EL PASO 1.".bgRed);
        } else {
            // Muestra el encabezado de la tabla.
            console.log("| Código | Nombre            | Inventario | Precio   |");
            console.log("|--------|-------------------|------------|----------|");
            // Itera sobre la lista de productos y muestra la información de cada producto.
            this.listaProductos.forEach(producto => {
                console.log(`| ${producto.codigoProducto}      | ${producto.nombreProducto}      | ${producto.inventarioProducto}          | ${producto.precioProducto}         |`);
            });
        }
        // Muestra el pie de la tabla
        console.log("=======================================================".yellow);
    }
    
    
    // Método para crear una copia de seguridad de la lista de productos en un archivo JSON.
    crearCopiaDeSeguridad() {
        const readline = require('readline-sync');
        console.clear();
        console.log(`==========================================================`.red);
        console.log(`=              CREAR COPIA DE SEGURIDAD                  =`.red);
        console.log(`==========================================================\n`.red);

        // Solicita al usuario un nombre para la copia de seguridad.
        const nombreCopia = readline.question("Ingrese el nombre para la copia de respaldo (sin extension): ");

        // Convierte la lista de productos a formato JSON.
        const backupData = JSON.stringify(this.listaProductos);
        const nombreArchivo = `${nombreCopia}.json`;

        // Escribe la copia de seguridad en un archivo.
        fs.writeFileSync(nombreArchivo, backupData, 'utf-8');
        console.log(`Copia de seguridad creada correctamente en ${nombreArchivo}`.bgGreen);
    }

    // Método para mostrar archivos JSON disponibles en el directorio actual.
    mostrarArchivosJSON() {
        // Obtiene la lista de archivos JSON en el directorio actual.
        const archivosJSON = fs.readdirSync('./').filter(file => file.endsWith('.json'));
        // Limpia la consola.
        console.clear();
        // Muestra información sobre la operación de restauración
        console.log(`==========================================================`.red);
        console.log(`=              RESTAURAR COPIA DE SEGURIDAD              =`.red);
        console.log(`==========================================================\n`.red);
        console.log("Archivos .json disponibles:");
        // Muestra la lista de archivos JSON disponibles.
        archivosJSON.forEach(archivo => console.log(`- ${archivo}`));
    }

     // Método para cargar datos desde el archivo 'datos.json'.
    cargarDatosDesdeArchivos() {
        try {
            // Lee el contenido del archivo 'datos.json'.
            const data = fs.readFileSync('datos.json', 'utf-8');
            // Parsea el JSON y convierte los objetos JSON a instancias de la clase 'Producto'.
            const productosJSON = JSON.parse(data);
            this.listaProductos = productosJSON.map(productoJSON => Producto.fromJSON(productoJSON));
            console.log("Datos cargados correctamente desde datos.json");
        } catch (error) {
            // Muestra un mensaje de error en caso de fallo y muestra archivos JSON disponibles.
            console.error("Error al cargar los datos desde datos.json:", error.message);
            this.mostrarArchivosJSON();

            // Verifica si el archivo 'datos.json' aún existe.
            if (fs.existsSync('datos.json')) {
                console.log("¡Aún existe el archivo datos.json!");
            } else {
                // Solicita al usuario el nombre del archivo .json a recuperar.
                const readline = require('readline-sync');
                const archivoRecuperar = readline.question("Ingrese el nombre del archivo .json a recuperar (sin extension): ");
                this.cargarDesdeArchivoEspecifico(`${archivoRecuperar}.json`);
            }
        }
    }

    // Método para cargar datos desde un archivo específico.
    cargarDesdeArchivoEspecifico(archivo) {
        try {
            // Lee el contenido del archivo especificado.
            const data = fs.readFileSync(archivo, 'utf-8');
            // Parsea el JSON y convierte los objetos JSON a instancias de la clase 'Producto'.
            const productosJSON = JSON.parse(data);
            this.listaProductos = productosJSON.map(productoJSON => Producto.fromJSON(productoJSON));
            console.log(`Datos cargados correctamente desde ${archivo}`.bgGreen);
        } catch (error) {
            // Muestra un mensaje de error en caso de fallo.
            console.error(`Error al cargar desde ${archivo}:`.bgRed, error.message);
        }
    }

    // Método para cargar datos desde el archivo 'datos.json' y mostrar estadísticas.
    cargarDatosDesdeArchivo() {
        try {
            // Lee el contenido del archivo 'datos.json'.
            const data = fs.readFileSync('datos.json', 'utf-8');
            // Parsea el JSON y convierte los objetos JSON a instancias de la clase 'Producto'.
            const productosJSON = JSON.parse(data);
            this.listaProductos = productosJSON.map(productoJSON => Producto.fromJSON(productoJSON));
            //limpia la consola
            console.clear();
            console.log(`================================================`.green);
            console.log("=  Datos cargados correctamente desde datos.json");
            console.log("=  Número de productos cargados:", this.listaProductos.length);
            console.log(`================================================`.green);

        } catch (error) {
             // Muestra un mensaje de error en caso de fallo y muestra archivos JSON disponibles.
            console.error("Error al cargar los datos desde datos.json:", error.message);
            this.mostrarArchivosJSON();
            
            // Verifica si el archivo 'datos.json' aún existe.
            if (fs.existsSync('datos.json')) {
                console.log("¡Aún existe el archivo datos.json!");
            } else {
                // Solicita al usuario el nombre del archivo .json a recuperar.
                const readline = require('readline-sync');
                const archivoRecuperar = readline.question("Ingrese el nombre del archivo .json a recuperar (sin extensión): ");
                this.cargarDesdeArchivoEspecifico(`${archivoRecuperar}.json`);
            }
        }
    }
    
    // Método para buscar un producto por código.
    buscarProducto(codigo) {
        // Busca el producto en la lista por su código.
        return this.listaProductos.find(producto => producto.codigoProducto === codigo);
    }

    // Método para borrar un producto por código.
    borrarProducto(codigo) {
         // Obtiene el índice del producto en la lista.
        const indice = this.listaProductos.findIndex(producto => producto.codigoProducto === codigo);

        // Verifica si el producto existe y lo elimina de la lista.
        if (indice !== -1) {
            this.listaProductos.splice(indice, 1);
            console.log(`Producto con código ${codigo} eliminado correctamente.`.bgGreen);
        } else {
            //retorna un 
            console.log(`No se encontró un producto con código ${codigo}.`.bgRed);
        }
    }
}

//Definicion de la 3ra clase ``Tienda`
class Tienda {
    // Constructor de la clase Tienda
    constructor() {
        // Inicializa el carrito como un array vacío
        this.carrito = [];
    }

    // Método para comprar un producto
    comprarProducto(producto, cantidad) {
        // Verifica si hay suficiente inventario
        if (producto.inventarioProducto >= cantidad) {
            // Actualiza el inventario y agrega el producto al carrito
            producto.inventarioProducto -= cantidad;
            this.carrito.push({ producto, cantidad });
            console.log(`¡Producto ${producto.nombreProducto} agregado al carrito!`);
        } else {
            console.log("¡No hay suficiente inventario!");
        }
    }

    // Método para imprimir la factura
    imprimirFactura(cliente) {
        console.clear();
        console.log(`===============================================`.cyan);
        console.log(`=                  FACTURA                    =`.cyan);
        console.log(`===============================================`.cyan);

        console.log(`Cliente: ${cliente.nombre} =`);
        console.log(`Documento: ${cliente.documento} =`);
        console.log(`Dirección: ${cliente.direccion} =`);
        console.log("===================");

        let total = 0;
        // Recorre los elementos en el carrito
        this.carrito.forEach(item => {
            const { producto, cantidad } = item;
            const subtotal = cantidad * producto.precioProducto;
            // Imprime los detalles del producto en la factura
            console.log(`Producto: ${producto.nombreProducto}, Cantidad: ${cantidad}, Subtotal: ${subtotal}`);
            console.log("===================");
            total += subtotal;
        });
        // Imprime el total a pagar
        console.log(`Total a pagar: ${total}`);
        console.log("===================");
    }

    // Método para iniciar la aplicación
    iniciar() {
        const readline = require('readline-sync');

        // Crea una instancia de la clase ProductosTienda
        const productosTienda = new ProductosTienda();

        // Bucle principal
        while (true) {
            console.log(`==============================`.blue);
            console.log(`==        TIENDA CBA        == `.blue);
            console.log(`==============================\n`.blue);
            console.log(`==============================`.blue);
            console.log(`=`.blue+` ${'1.'.white} Cargar Datos            =`);
            console.log(`=`.blue+` ${'2.'.white} Copia de Respaldo       =`);
            console.log(`=`.blue+` ${'3.'.white} Reparar Datos           =`);
            console.log(`=`.blue+` ${'4.'.white} Grabar Nuevos Productos =`);
            console.log(`=`.blue+` ${'5.'.white} Borrar Producto         =`);
            console.log(`=`.blue+` ${'6.'.white} Comprar Productos       =`);
            console.log(`=`.blue+` ${'7.'.white} Imprimir Factura        =`);
            console.log(`=`.blue+` ${'0.'.white} Cerrar App              =`);
            console.log(`==============================\n`.blue);

             // Lee la opción seleccionada por el usuario
            const opcion = readline.questionInt("Seleccione una opcion: ");

            // Realiza acciones según la opción seleccionada
            switch (opcion) {
                case 1:
                    //llama la clase y su respectivo metodo
                    productosTienda.cargarDatosDesdeArchivo();
                    break;
                    case 2:
                    //llama la clase y su respectivo metodo
                    productosTienda.crearCopiaDeSeguridad();
                    break;
                    case 3:
                    //esta llamando al metodo mostrararchivosJSON que esta instanciada
                    productosTienda.mostrarArchivosJSON();
                    //Utiliza el módulo readline para solicitar al usuario que ingrese el nombre del archivo JSON que desea recuperar, sin la extensión .json
                    const archivoRecuperar = readline.question("Ingrese el nombre del archivo .json a recuperar (sin extensión): ");
                    //Este método intentará cargar los datos desde el archivo especificado y actualizará la lista de productos en productosTienda con los datos recuperados
                    productosTienda.cargarDesdeArchivoEspecifico(`${archivoRecuperar}.json`);
                    break;
                case 4:
                    //muestra todos los productos que hay en el archivo JSON
                productosTienda.mostrarProductos();
                //Utiliza el módulo readline para solicitar al usuario que ingrese el código del nuevo producto.
                const codigoNuevo = readline.question("Ingrese el codigo del nuevo producto: ");
                //Solicita al usuario que ingrese el nombre del nuevo producto,La entrada proporcionada por el usuario se almacena en la variable nombreNuevo.
                const nombreNuevo = readline.question("Ingrese el nombre del nuevo producto: ");
                //readline.questionInt garantiza que la entrada se interprete como un número entero
                const inventarioNuevo = readline.questionInt("Ingrese el inventario del nuevo producto: ");
                //readline.questionFloat garantiza que la entrada se interprete como un número de punto flotante.
                const precioNuevo = readline.questionFloat("Ingrese el precio del nuevo producto: ");
                //Crea una nueva instancia de la clase Producto con los valores proporcionados por el usuario (código, nombre, inventario, precio),Los valores ingresados por el usuario se utilizan como argumentos para el constructor de Producto
                const nuevoProducto = new Producto(codigoNuevo, nombreNuevo, inventarioNuevo, precioNuevo);
                //Llama al método agregarProducto(producto) de la instancia productosTienda, pasando la nueva instancia de Producto como argumento
                productosTienda.agregarProducto(nuevoProducto);
                //retorna el mensaje
                console.log("¡Nuevo producto agregado!".bgGreen);
                    break;
                case 5:
                //Muestra los productos que estan disponibles
                productosTienda.mostrarProductos();
                //Utiliza el módulo readline para solicitar al usuario que ingrese el código del producto que desea borrar, La entrada proporcionada por el usuario se almacena en la variable codigoBorrar.
                const codigoBorrar = readline.question("Ingrese el codigo del producto a borrar: ");
                //Llama al método borrarProducto(codigo) de la instancia productosTienda, pasando el código del producto que el usuario desea borrar como argumento.
                //Este método busca el producto con el código proporcionado en la lista de productos de productosTienda y lo elimina de la lista si se encuentra.
                //Imprime mensajes en la consola indicando si el producto fue eliminado correctamente o si no se encontró un producto con el código proporcionado.
                productosTienda.borrarProducto(codigoBorrar);
                    
                break;
                case 6:
                // Comprar Productos
                  productosTienda.mostrarProductos();
                    
                        

               // Inicia un bucle para permitir al usuario comprar productos.
               while (true) {
               // Solicita al usuario que ingrese el código del producto que desea comprar, o '0' para finalizar.
              const codigoCompra = readline.question("Ingrese el código del producto a comprar (o '0' para finalizar):");

             // Si el usuario ingresa '0', sale del bucle y termina la compra.
              if (codigoCompra === '0') {
                  break;
                                }

               // Busca el producto en la tienda usando el código proporcionado por el usuario.
                const productoAComprar = productosTienda.buscarProducto(codigoCompra);
                                    // Verifica si el producto existe.
                                if (productoAComprar) {
                                    // Muestra un mensaje solicitando al usuario que ingrese la cantidad que desea comprar, con la disponibilidad actual.
                                    console.log(`Ingrese la cantidad de (${productoAComprar.nombreProducto}) que desea comprar, disponibles(${productoAComprar.inventarioProducto})`);

                                    // Solicita al usuario que ingrese la cantidad de productos que desea comprar.
                                        const cantidadCompra = readline.questionInt("Cantidad a comprar:");

                                        // Verifica si la cantidad de productos solicitada está disponible en el inventario.
                                if (cantidadCompra <= productoAComprar.inventarioProducto) {
                                    // Realiza la compra llamando al método comprarProducto de la instancia tienda.
                                    tienda.comprarProducto(productoAComprar, cantidadCompra);
                                } else {
                                    console.log("¡No hay suficientes unidades disponibles!");
                                }
                            } else {
                                console.log("¡Producto no encontrado!");
                            }

                            // Pregunta al usuario si desea comprar otro producto y continua el bucle si la respuesta es afirmativa.
                            const deseaComprarOtro = readline.keyInYNStrict("¿Desea comprar otro producto?");

                            // Si el usuario no desea comprar más productos, se rompe el bucle.
                            if (!deseaComprarOtro) {
                                break;
                             }
                             }
                              break;

            case 7:
                // Opción 7: Imprimir Factura
                // Limpia la consola y muestra un encabezado para la sección de datos del cliente.
                console.clear();
                console.log(`===============================================`.cyan);
                console.log(`=              DATOS DEL CLIENTE              =`.cyan);
                console.log(`===============================================\n`.cyan);

                // Solicita al usuario que ingrese su nombre, documento y dirección.
                const nombreCliente = readline.question("Ingrese su nombre:");
                const documentoCliente = readline.question("Ingrese su documento:");
                const direccionCliente = readline.question("Ingrese su dirección:");

                // Crea un objeto cliente con la información proporcionada por el usuario.
                const cliente = { nombre: nombreCliente, documento: documentoCliente, direccion: direccionCliente };

                // Llama al método imprimirFactura de la instancia actual para imprimir la factura con los datos del cliente.
                this.imprimirFactura(cliente);
                break;

                case 0:
                    // Cerrar App
                    process.exit(0);
                    break;
                default:
                    console.log("Opción no válida. Inténtelo de nuevo.");
            }
        }
    }
}
//instancia la clase tienda
const tienda = new Tienda();
// Cargar datos al iniciar la aplicación
tienda.iniciar();


