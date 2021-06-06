import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
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
import { HorizontalBarComponent } from './main/content/artists/artist-item/horizontal-bar/horizontal-bar.component';
import { PaginationComponent } from './main/content/artists/pagination/pagination.component';
import { ArtistComponent } from './main/content/artists/artist-item/artist/artist.component';
import { ArtistItemComponent } from './main/content/artists/artist-item/artist-item.component';
import { NumberCardsComponent } from './main/content/artists/artist-item/artist/number-cards/number-cards.component';
import { ArtistProfileComponent } from './main/content/artists/artist-item/artist/artist-profile/artist-profile.component';
import { HBarSComponent } from './main/content/artists/artist-item/artist/artist-profile/h-bar-s/h-bar-s.component';
import { LineComponent } from './main/content/artists/artist-item/artist/line/line.component';

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
    ArtistComponent,
    ArtistItemComponent,
    NumberCardsComponent,
    ArtistProfileComponent,
    HBarSComponent,
    LineComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxChartsModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
