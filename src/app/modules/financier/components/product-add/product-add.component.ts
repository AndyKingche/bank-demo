import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FinancierService } from '../../services/financier.service';
import { Product } from '../../models/product.model';
import { ActivatedRoute, Router } from '@angular/router';



@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.scss']
})
export class ProductAddComponent implements OnInit {

  productForm!: FormGroup;
  todayDate: string = '';
  addMessage : boolean = false;
  updateMessage : boolean = false;
  erroresMessage : boolean = false;
  message_error : string = " ";
  edit : boolean = false;
  idEdit: string = ' ';
  
  constructor(private financierService:FinancierService, private formulario: FormBuilder,  private activedrouter: ActivatedRoute, private ruta: Router) { }

  async ngOnInit(){

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    this.todayDate = `${year}-${month}-${day}`;

    const params = this.activedrouter.snapshot.params;

    if(params.id){
    

      this.productForm = this.formulario.group({
        id:[{value:'',disabled:true},[Validators.required,
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

      const existProduct = await this.financierService.checkProduct(params.id).toPromise();
      
      if(existProduct){
        this.idEdit = params.id;
        this.edit = true;
        const product =  await this.financierService.getProduct(params.id).toPromise();

        this.productForm.get('id')?.disable;
  
        this.productForm.patchValue({
          id: product.id,
          name: product.name,
          description: product.description,
          logo: product.logo,
          date_release: product.date_release,
          date_revision: product.date_revision
        });

        this.productForm.get('date_release')?.valueChanges.subscribe(value => {
          if (value) {
            const dateRelease = new Date(value);
            const nextYear = new Date(dateRelease);
            nextYear.setFullYear(nextYear.getFullYear() + 1);
            this.productForm.get('date_revision')?.setValue(nextYear.toISOString().substring(0, 10));
          }
        });

      }else{
        this.ruta.navigate(['/product-list'])
      }

    }else{

      this.edit = false;
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
    }

    this.addMessage = false;
    this.updateMessage = false;
    this.erroresMessage = false;
    this.message_error = " ";

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
      next: (product:any)=>{

        //console.log(product);
        
        this.addMessage = true;
        this.updateMessage = false;
        this.erroresMessage = false;
        this.productForm.reset();
        this.message_error = " ";
      },
      error:(error:any)=>{
        console.error('Error creando un producto', error)
        console.log(error.error.message);
        this.message_error = error.error.message;
        this.addMessage = false;
        this.updateMessage = false;
        this.erroresMessage = true;
      }
    })

    this.addMessage= false;
  }else{
    console.log("Formulario Invalido");
    this.erroresMessage = true;
    this.message_error = " ";
    this.addMessage = false;
    this.updateMessage =  false;
  }
  


  }

  updateProduct(){
    if(this.productForm.valid){

      const{id,...productsinId}= this.productForm.getRawValue();

      console.log(productsinId);
      
      this.financierService.getUpdate(this.productForm.getRawValue(), this.idEdit).subscribe({
        next: (product:any)=>{
  
          //console.log(product);
          
          this.addMessage = false;
          this.updateMessage = true;
          this.erroresMessage = false;
          //this.productForm.reset();
          this.message_error = " ";
        },
        error:(error:any)=>{
          console.error('Error creando un producto', error)
          console.log(error.error.message);
          this.message_error = error.error.message;
          this.addMessage = false;
          this.updateMessage = false;
          this.erroresMessage = true;
        }
      })
  
      this.addMessage= false;
    }else{
      console.log("Formulario Invalido");
      this.erroresMessage = true;
      this.message_error = " ";
      this.addMessage = false;
      this.updateMessage =  false;
    }
  }

  onResets(){
    
    console.log(this.edit);
    console.log('boton reiniciar');
    if(this.edit){
      this.productForm.get('name')?.setValue('');
      this.productForm.get('description')?.setValue('');
      this.productForm.get('date_release')?.setValue('');
      this.productForm.get('date_revision')?.setValue('');
      this.productForm.get('logo')?.setValue('');
      this.addMessage = false;
      this.updateMessage = false;
      this.erroresMessage = false;
      this.message_error = " ";

    }else{
      this.productForm.reset();
      this.addMessage = false;
      this.updateMessage = false;
      this.erroresMessage = false;
      this.message_error = " ";
    }
    }
    


}
