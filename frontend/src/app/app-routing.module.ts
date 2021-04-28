import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArtistComponent } from './main/content/artists/artist-item/artist/artist.component';
import { ArtistsComponent } from './main/content/artists/artists.component';

const routes: Routes = [
  { path: '',   redirectTo: '/artists', pathMatch: 'full' },
  { path: 'artists', component: ArtistsComponent },
  { path: 'artists/page/:page_num', component: ArtistsComponent },
  { path: 'artist/:name/:id', component: ArtistComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
