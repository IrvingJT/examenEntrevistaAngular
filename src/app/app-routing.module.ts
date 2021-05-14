import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CarruselComponent } from './components/carrusel/carrusel.component';
import { EmpleadosComponent } from './components/empleados/empleados.component';
import { GruposComponent } from './components/grupos/grupos.component';

const APP_ROUTES: Routes = [
{ path:'carrusel', component: CarruselComponent,},
{ path:'empleados', component: EmpleadosComponent,},
{ path:'grupos', component: GruposComponent,},
{ path:'**', pathMatch:'full', redirectTo:'carrusel'},
];

@NgModule({
  imports: [RouterModule.forRoot(APP_ROUTES)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
