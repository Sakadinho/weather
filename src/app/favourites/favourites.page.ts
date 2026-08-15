import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
} from '@ionic/angular/standalone';
import { ViewWillEnter } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { trash } from 'ionicons/icons';
import { FavouritesService } from '../services/favourites.service';
import { WeatherService, CityWeather } from '../services/weather.service';

@Component({
  selector: 'app-favourites',
  templateUrl: 'favourites.page.html',
  styleUrls: ['favourites.page.scss'],
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
  ],
})
export class FavouritesPage implements ViewWillEnter {
  private favouritesService = inject(FavouritesService);
  private weatherService = inject(WeatherService);

  favourites: string[] = [];
  selectedWeather: CityWeather | null = null;
  loading = false;

  constructor() {
    addIcons({ trash });
  }

  async ionViewWillEnter() {
    this.favourites = await this.favouritesService.getFavourites();
  }

  async remove(city: string) {
    await this.favouritesService.removeFavourite(city);
    this.favourites = await this.favouritesService.getFavourites();
  }

  viewWeather(city: string) {
    this.loading = true;
    this.selectedWeather = null;
    this.weatherService.getWeatherForCity(city).subscribe({
      next: (result) => {
        this.selectedWeather = result;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  weatherDescription(): string {
    if (!this.selectedWeather) {
      return '';
    }
    return this.weatherService.describeWeatherCode(this.selectedWeather.weather.weathercode);
  }
}
