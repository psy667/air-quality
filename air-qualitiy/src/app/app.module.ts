import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  TuiActionModule,
  TuiDataListWrapperModule,
  TuiMarkerIconModule,
  TuiRadioListModule,
  TuiSelectModule
} from '@taiga-ui/kit';
import {TuiRootModule, TuiSvgModule, TuiTextfieldControllerModule} from '@taiga-ui/core';
import {HttpClientModule} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {NgxEchartsModule} from 'ngx-echarts';
import {ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

export function loadEcharts() {
  return import('echarts');
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    TuiMarkerIconModule,
    TuiRootModule,
    HttpClientModule,
    TuiActionModule,
    TuiSvgModule,
    NgxEchartsModule.forRoot({
      echarts: loadEcharts
    }),
    TuiSelectModule,
    TuiDataListWrapperModule,
    TuiTextfieldControllerModule,
    ReactiveFormsModule,
    TuiRadioListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
