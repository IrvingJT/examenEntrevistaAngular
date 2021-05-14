import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-grupos',
  templateUrl: './grupos.component.html',
  styleUrls: ['./grupos.component.css']
})
export class GruposComponent {

  obsGrupos = new Observable();

  grupos = [];
  detalleGrupos =[];
  tituloDetalleGrupos = [];

  seleccionarTodo:boolean = true;

  constructor(private http: HttpClient) {

    this.obsGrupos = this.http.get('https://6edeayi7ch.execute-api.us-east-1.amazonaws.com/v1/examen/groups/Irving');

    this.obtenerGrupos();
   }

   obtenerGrupos()
   {
     this.obsGrupos.pipe(
       map((grp:any) => grp.data),
       map((grpData:any) => grpData.groups )
     ).subscribe(resp => {

       this.grupos = resp;

       console.log(this.grupos);
     });
   }

   drop(event: CdkDragDrop<string[]>) {

     let ok = true;
     let id = 1;

     if (event.previousContainer === event.container) {
      // moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      ok=true;
      id=event.currentIndex+1;
    } else {
      // transferArrayItem(event.previousContainer.data,
      //                   event.container.data,
      //                   event.previousIndex,
      //                   event.currentIndex);
      ok:false;
    }

     if(ok)
      {
        this.http.get(`https://6edeayi7ch.execute-api.us-east-1.amazonaws.com/v1/examen/employees/Irving/getByGroup?id=${id}`)
        .pipe(

          map((resp:any)=>{
            if(resp)
            {
              return resp.data;
            }
            else{

              return;
            }
          }),
          map((resp:any)=>{
            if(resp!=null)
            {
              return resp.employees;
            }
            else{
              return;
            }
          }),
          map(resp=>{

            this.grupos.forEach(element => {
              if(element.id == resp[0].group_id)
              {
                this.tituloDetalleGrupos = [{group_id:0,id:0,name:element.name}];
              }
            });
            return resp;
          })
        )
        .subscribe( resp => {
          // console.log(resp[0].id);

          if(resp!=null)
          {
            this.detalleGrupos = resp;
          }
          else{
            return;
          }

        });
      }


  }

  cambiarEstado(isChecked:boolean)
  {
    this.seleccionarTodo = isChecked;
  }


}
