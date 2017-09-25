import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatGridListModule, MatToolbarModule, MatButtonModule, MatInputModule } from '@angular/material';
import { CovalentDataTableModule, CovalentLoadingModule } from '@covalent/core';
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

    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    MatGridListModule,
    BrowserAnimationsModule,

    CovalentLoadingModule,
    CovalentDataTableModule,
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
