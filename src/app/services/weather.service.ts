import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap, throwError } from 'rxjs';

export interface CityResult {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface CurrentWeather {
  temperature: number;
  windspeed: number;
  weathercode: number;
}

export interface CityWeather {
  city: CityResult;
  weather: CurrentWeather;
}

const WEATHER_CODES: { [code: number]: string } = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Foggy',
  51: 'Light drizzle',
  53: 'Drizzle',
  55: 'Heavy drizzle',
  61: 'Light rain',
  63: 'Rain',
  65: 'Heavy rain',
  71: 'Light snow',
  73: 'Snow',
  75: 'Heavy snow',
  80: 'Rain showers',
  81: 'Rain showers',
  82: 'Violent rain showers',
  95: 'Thunderstorm',
};

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private http = inject(HttpClient);
  private geocodeUrl = 'https://geocoding-api.open-meteo.com/v1/search';
  private forecastUrl = 'https://api.open-meteo.com/v1/forecast';

  searchCity(name: string): Observable<CityResult[]> {
    const url = `${this.geocodeUrl}?name=${encodeURIComponent(name)}&count=5`;
    return this.http.get<any>(url).pipe(
      map((res) =>
        (res.results || []).map((r: any) => ({
          name: r.name,
          country: r.country,
          latitude: r.latitude,
          longitude: r.longitude,
        }))
      )
    );
  }

  getCurrentWeather(lat: number, lon: number): Observable<CurrentWeather> {
    const url = `${this.forecastUrl}?latitude=${lat}&longitude=${lon}&current_weather=true`;
    return this.http.get<any>(url).pipe(map((res) => res.current_weather));
  }

  getWeatherForCity(name: string): Observable<CityWeather> {
    return this.searchCity(name).pipe(
      switchMap((results) => {
        if (results.length === 0) {
          return throwError(() => new Error('City not found'));
        }
        const city = results[0];
        return this.getCurrentWeather(city.latitude, city.longitude).pipe(
          map((weather) => ({ city, weather }))
        );
      })
    );
  }

  describeWeatherCode(code: number): string {
    return WEATHER_CODES[code] || 'Unknown';
  }
}
