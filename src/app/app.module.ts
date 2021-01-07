import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LobbyComponent } from './lobby/lobby.component';
import { AdaptPointsComponent } from './adapt-points/adapt-points.component';
import { RouterModule, Routes } from '@angular/router';
import { NavigationComponent } from './navigation/navigation.component';
import { FormsModule } from '@angular/forms';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { ImpressumComponent } from './impressum/impressum.component';

const appRoutes: Routes = [
  { path: 'lobby', component: LobbyComponent },
  { path: 'adapt-points/:playerId', component: AdaptPointsComponent },
  { path: 'adapt-points', component: AdaptPointsComponent },
  { path: 'imprint', component: ImpressumComponent},
  { path: '',
    redirectTo: '/lobby',
    pathMatch: 'full'
  },
  { path: '**', component: LobbyComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    LobbyComponent,
    AdaptPointsComponent,
    NavigationComponent,
    ImpressumComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
