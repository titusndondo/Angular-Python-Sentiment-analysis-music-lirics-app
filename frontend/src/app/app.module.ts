import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { NavbarComponent } from './main/navbar/navbar.component';
import { ContainerComponent } from './main/container/container.component';
import { SidebarComponent } from './main/container/sidebar/sidebar.component';
import { ContentComponent } from './main/container/content/content.component';
import { ArtistsComponent } from './main/container/content/artists/artists.component';
import { HorizontalBarComponent } from './main/container/content/artists/horizontal-bar/horizontal-bar.component';
import { PaginationComponent } from './main/container/content/artists/pagination/pagination.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    NavbarComponent,
    ContainerComponent,
    SidebarComponent,
    ContentComponent,
    ArtistsComponent,
    HorizontalBarComponent,
    PaginationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxChartsModule, 
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
