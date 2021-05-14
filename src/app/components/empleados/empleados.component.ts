import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { filter,map } from 'rxjs/operators';

import Swal from 'sweetalert2'

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css']
})
export class EmpleadosComponent {

  obs = new Observable();


  empleados : any[] = [];
  data : any[] =[];

  guardado : any;

  forma: FormGroup;

  constructor(private http: HttpClient, private fb: FormBuilder) {

    this.obs = this.http.get('https://6edeayi7ch.execute-api.us-east-1.amazonaws.com/v1/examen/employees/Irving');

    this.buscar('');

    this.crearFormulario();

   }

   get nombreNoValido()
   {
     return this.forma.get('nombre').invalid && this.forma.get('nombre').touched;
   }
   get apellidoNoValido()
   {
     return this.forma.get('apellidos').invalid && this.forma.get('apellidos').touched;
   }
   get fechaNoValida()
   {
     return this.forma.get('fecha').invalid && this.forma.get('fecha').touched;
   }

   buscar(termino: string){

    if(termino=='')
    {
      this.obs.subscribe((empleadosArr:any)=>{

        const { data } = empleadosArr;
        const {employees} = data;


        this.empleados=employees;



      });
    }
    else{
      this.obs.pipe(

        map((emp:any) => emp.data),
        map((empData:any) => empData.employees ),
        // map((empDataEmployees1:any) => empDataEmployees1.name.includes(termino) ),
        map((empDataEmployees:any)=>{

          // console.log(empDataEmployees);

          const mapeo = empDataEmployees.filter( empleado => {

            return empleado.name.toLowerCase().includes(termino.toLocaleLowerCase()) ;

          });

         return mapeo;

        })
      ).subscribe((empleadosArr:any)=>{



        this.empleados=empleadosArr;




      });
    }





  }

  crearFormulario()
  {
    this.forma = this.fb.group({
      nombre:['',[Validators.required]],
      apellidos:['',[Validators.required]],
      fecha:['',[Validators.required]]
    });
  }


guardar(){

  if ( this.forma.invalid )
  {
    Object.values( this.forma.controls )
    .forEach( control => {
      if ( control instanceof FormGroup )
      {
        Object.values( control.controls ).forEach( control => control.markAsTouched() );
      }
      else
      {
        control.markAsTouched();
      }
    });

   return;
  }


  const {nombre, apellidos, fecha} = this.forma.value;

  const payload = {
    "name":nombre,
    "last_name":apellidos,
    "birthday":fecha
  };

  console.log(payload);

  this.http.post('https://6edeayi7ch.execute-api.us-east-1.amazonaws.com/v1/examen/employees/Irving',payload).subscribe(resp=>{

  console.log(resp);

  if(resp.success)
  {
    this.guardado=true;
    Swal.fire(
      'Nice!',
      resp.data,
      'success'
    )
  }
  else{
    Swal.fire(
      'Oh no!',
      resp.data,
      'error'
    )
  }

  this.buscar('');
  });


}

}
