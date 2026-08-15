import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonSpinner,
} from '@ionic/angular/standalone';
import { Geolocation } from '@capacitor/geolocation';
import { WeatherService, CurrentWeather } from '../services/weather.service';

@Component({
  selector: 'app-location',
  templateUrl: 'location.page.html',
  styleUrls: ['location.page.scss'],
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonSpinner],
})
export class LocationPage {
  private weatherService = inject(WeatherService);

  latitude = 0;
  longitude = 0;
  currentWeather: CurrentWeather | null = null;
  loading = false;
  errorMessage = '';

  async useMyLocation() {
    this.loading = true;
    this.errorMessage = '';
    this.currentWeather = null;
    try {
      const position = await Geolocation.getCurrentPosition();
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      this.weatherService.getCurrentWeather(this.latitude, this.longitude).subscribe({
        next: (weather) => {
          this.currentWeather = weather;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.errorMessage = 'Could not load the weather for your location';
        },
      });
    } catch (err) {
      this.loading = false;
      this.errorMessage = 'Could not access your location, check permissions';
    }
  }

  weatherDescription(): string {
    if (!this.currentWeather) {
      return '';
    }
    return this.weatherService.describeWeatherCode(this.currentWeather.weathercode);
  }
}
