import { Component, OnInit } from '@angular/core';
import { FinancierService } from '../../services/financier.service';
import { Product } from '../../models/product.model';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  listProduct: Product[] = [];
  filterProduct: Product[] = []; // se creó para poder tener los productos filtrados de la busqueda
  searchControl = new FormControl('');
  itmesNumber: number = 5; // items por carga
  listCuantity: any[] = []; // lista del grupo de la cantidad de productos que se desea mostrar
  selectedProduct : Product | null = null ; // Se creó para obtener el producto a eliminar
  showModal : boolean = false;
  isLoading: boolean = false; 

  constructor(private financierService: FinancierService, private router: Router) {}

  ngOnInit(): void {
    this.getlistProduct();

    this.searchControl.valueChanges.subscribe((value) => {

      this.filterProduct = this.listProduct.filter((product) =>
        product.name.toLowerCase().includes(value.toLowerCase())
      );

      if(value.length==0){

        this.itmesNumber = 5;
       // console.log(this.itmesNumber);
        this.getPaginationProduct();
      }
    });
  }

  async getlistProduct() {
    try {
      this.financierService.getlistProduct().subscribe((resp: any) => {
        if (resp) {
          this.listProduct = resp.data;
          this.filterProduct = resp.data;

          console.log(this.listProduct); 

          this.getPaginationProduct();
          this.getCuantity();

        }
      });
    } catch (error) {
      console.error('ERROR EN GETLISTPRODUCT', error);
    }
  }

  onSelected(items: any){

    //console.log(items);
    this.itmesNumber = +items.target.value; // se van sumando el numero de cantidades deseadas

    this.getPaginationProduct();

 
  }

 /**
 * Esta función selecciona y muestra los productos correspondientes a la página actual
 * según el número de elementos seleccionados por página [5, 10, 15, 20].
 */
  getPaginationProduct() {

    const start = 0;
    let end = start + this.itmesNumber;

    this.filterProduct = this.listProduct.slice(start, end);
  }

/**
 * Esta funcion obtiene el numero de registros del producto y lo divide para 5, para asi tener las opciones de 5 en 5
 */
  getCuantity(){   
    const cantidad = Math.ceil(this.listProduct.length / 5);

    for( let i =0; i < cantidad; i++  ){
      this.listCuantity [i] = (i+1) * 5;
    } 
    
  }

  onDropdownChange(event: Event, product: any) {
    const selectedOption = (event.target as HTMLSelectElement).value;

    if (selectedOption === 'edit') {
      console.log(product.id);
      
      this.editProduct(product);
    }

    if (selectedOption === 'delete') {
      this.selectedProduct = product;
      this.showModal = true;      
 
    }
    (event.target as HTMLSelectElement).value = '';
  }


  editProduct(product:any) {

    this.router.navigate(['/product-edit', product.id], {
      state: { product },
    });
  }

  addNewProduct(){
    this.router.navigate(['/product-add']);
  }

  closeModal(){
    this.showModal = false;
    this.selectedProduct = null; 
  }

  deleteProduct(){
    if (this.selectedProduct) {
      this.isLoading = true; 
      this.financierService.deleteProduct(this.selectedProduct.id).subscribe((res:any) => {
        this.getlistProduct();
        this.getCuantity();
        this.closeModal(); 
        this.isLoading = false;
      
      });
    }
  }

}
