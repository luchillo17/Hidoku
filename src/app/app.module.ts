import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatGridListModule, MatToolbarModule } from '@angular/material';
import { CovalentDataTableModule } from '@covalent/core';
import { NgxErrorsModule } from '@ultimate/ngxerrors';

import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,

    FormsModule,
    ReactiveFormsModule,
    NgxErrorsModule,

    MatToolbarModule,
    MatGridListModule,
    BrowserAnimationsModule,
    CovalentDataTableModule,
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
