import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FinancierService } from '../../services/financier.service';
import { Product } from '../../models/product.model';



@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.scss']
})
export class ProductAddComponent implements OnInit {

  productForm!: FormGroup;
  todayDate: string = '';
  add : boolean = false;
  update : boolean = false;
  errores : boolean = false;
  message_error : string = " ";
  
  constructor(private financierService:FinancierService, private formulario: FormBuilder) { }

  ngOnInit(){

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

  this.todayDate = `${year}-${month}-${day}`;


    console.log(this.todayDate);
    

    this.add = false;
    this.update = false;
    this.errores = false;
    this.message_error = " ";

    this.productForm = this.formulario.group({
      id:['',[Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10)]
      ],
      name:['',[Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100)]
      ],
      description:['',[Validators.required, 
        Validators.minLength(10),Validators.maxLength(200)]],
      logo:['',[Validators.required]],
      date_release:['',[Validators.required]],
      date_revision: [{value:'',disabled: true}]
    });

    this.productForm.get('date_release')?.valueChanges.subscribe(value => {
      if (value) {
        const dateRelease = new Date(value);
        const nextYear = new Date(dateRelease);
        nextYear.setFullYear(nextYear.getFullYear() + 1);
        this.productForm.get('date_revision')?.setValue(nextYear.toISOString().substring(0, 10));
      }
    });

  }

 

  addProduct(){
    //console.log(this.productForm.getRawValue())

  if(this.productForm.valid){

    this.financierService.addProduct(this.productForm.getRawValue()).subscribe({
      next: (product)=>{
        this.add = true;
        this.update = false;
        this.errores = false;
        this.productForm.reset();
        this.message_error = " ";
      },
      error:(error:any)=>{
        console.error('Error creando un producto', error)
        console.log(error.error.message);
        this.message_error = error.error.message;
        this.add = false;
        this.update = false;
        this.errores = true;
      }
    })

    this.add= false;
  }else{
    console.log("Formulario Invalido");
    this.errores = true;
    this.message_error = " ";
    this.add = false;
    this.update =  false;
  }
  


  }

  onReset(){
    this.productForm.reset();
    this.add = false;
    this.update = false;
    this.errores = false;
    this.message_error = " ";
  }


}
