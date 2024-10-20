import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../../../../shared/services/carrito.service';
import { ProductoService } from '../../../../shared/services/producto.service';
import { Producto } from '../../../../shared/models/producto';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  carritoIds: string[] = []; // Array para almacenar los IDs de los productos en el carrito
  productos: Producto[] = []; // Array para almacenar los productos obtenidos

  constructor(
    private carritoService: CarritoService, // Servicio para manejar el carrito
    private productoService: ProductoService // Servicio para manejar productos
  ) {}

  // Método que se ejecuta al inicializar el componente
  ngOnInit(): void {
    this.carritoIds = this.carritoService.getCarritoIds(); // Obtiene los IDs del carrito
    this.cargarProductos(); // Carga los productos correspondientes a esos IDs
  }

  // Método para cargar los productos basados en los IDs del carrito
  cargarProductos(): void {
    this.productos = []; // Reinicia el array de productos
    for (const id of this.carritoIds) {
      // Itera sobre cada ID en el carrito
      this.productoService.getProductoById(id).subscribe({
        next: (producto: Producto) => {
          this.productos.push(producto); // Agrega el producto obtenido al array
        },
        error: () => {
          console.error('Error al cargar el producto con ID:', id); // Muestra un error en la consola si falla
        }
      });
    }
  }

  // Método para calcular el total del carrito
  calcularTotal(): number {
    // Suma el precio de cada producto, considerando una oferta si está disponible
    return this.productos.reduce((total, producto) => total + (producto.precioOferta || producto.precio), 0);
  }

  // Método para eliminar un producto del carrito
  eliminarDelCarrito(productoId: string): void {
    // Filtra el ID del producto que se va a eliminar del carrito
    this.carritoIds = this.carritoIds.filter(id => id !== productoId);
    // Actualiza el carrito en el servicio y en el almacenamiento local
    this.carritoService.setCarritoIds(this.carritoIds);
    localStorage.setItem('carritoIds', JSON.stringify(this.carritoIds));
    // Vuelve a cargar los productos para reflejar los cambios
    this.cargarProductos();
  }

  valorActual = 1; // Valor actual para un contador (puede representar cantidad de productos)

  // Método para incrementar el valorActual
  mas() {
    if (this.valorActual < 7) { // Limita el valor máximo a 7
      this.valorActual++;
    }
  }
  
  // Método para decrementar el valorActual
  menos() {
    if (this.valorActual > 1) { // Limita el valor mínimo a 1
      this.valorActual--;
    }
  }
}