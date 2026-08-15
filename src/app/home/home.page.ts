import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonSpinner,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { star } from 'ionicons/icons';
import { WeatherService, CityResult, CurrentWeather } from '../services/weather.service';
import { FavouritesService } from '../services/favourites.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSearchbar,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonIcon,
    IonSpinner,
  ],
})
export class HomePage {
  private weatherService = inject(WeatherService);
  private favouritesService = inject(FavouritesService);

  searchTerm = '';
  cityResults: CityResult[] = [];
  selectedCity: CityResult | null = null;
  currentWeather: CurrentWeather | null = null;
  loading = false;
  errorMessage = '';

  search() {
    if (!this.searchTerm.trim()) {
      return;
    }
    this.loading = true;
    this.errorMessage = '';
    this.currentWeather = null;
    this.weatherService.searchCity(this.searchTerm).subscribe({
      next: (results) => {
        this.cityResults = results;
        this.loading = false;
        if (results.length === 0) {
          this.errorMessage = 'No cities found, try another search';
        }
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Something went wrong fetching cities';
      },
    });
  }

  selectCity(city: CityResult) {
    this.selectedCity = city;
    this.cityResults = [];
    this.loading = true;
    this.weatherService.getCurrentWeather(city.latitude, city.longitude).subscribe({
      next: (weather) => {
        this.currentWeather = weather;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Could not load the weather for that city';
      },
    });
  }

  weatherDescription(): string {
    if (!this.currentWeather) {
      return '';
    }
    return this.weatherService.describeWeatherCode(this.currentWeather.weathercode);
  }

  async saveFavourite() {
    if (this.selectedCity) {
      await this.favouritesService.addFavourite(this.selectedCity.name);
    }
  }

  constructor() {
    addIcons({ star });
  }
}
