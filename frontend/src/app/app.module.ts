import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { NavbarComponent } from './main/navbar/navbar.component';
import { SidebarComponent } from './main/sidebar/sidebar.component';
import { ContentComponent } from './main/content/content.component';
import { ArtistsComponent } from './main/content/artists/artists.component';
import { HorizontalBarComponent } from './main/content/artists/horizontal-bar/horizontal-bar.component';
import { PaginationComponent } from './main/content/artists/pagination/pagination.component';
import { ArtistComponent } from './main/content/artists/artist/artist.component';


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    NavbarComponent,
    SidebarComponent,
    ContentComponent,
    ArtistsComponent,
    HorizontalBarComponent,
    PaginationComponent,
    ArtistComponent
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
