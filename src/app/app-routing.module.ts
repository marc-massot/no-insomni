import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NouDiaComponent } from './nou-dia/nou-dia.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: 'inici', component: HomeComponent },
  { path: 'nou-dia', component: NouDiaComponent },
  { path: '',   redirectTo: '/inici', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
