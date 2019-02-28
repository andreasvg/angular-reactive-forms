import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { CustomerComponent } from './customers/customer.component';
import { ExperimentComponent } from './experiment/experiment.component';
import { Customer2Component } from './customers/customer2/customer2.component';
import { AddressComponent } from './address/address.component';
import { Address2Component } from './address2/address2.component';

const routes = [
  { path: 'experiment', component: ExperimentComponent },
  { path: '', component: Customer2Component}
];

@NgModule({
  declarations: [
    AppComponent,
    CustomerComponent,
    ExperimentComponent,
    Customer2Component,
    AddressComponent,
    Address2Component
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes)
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
