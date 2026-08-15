# WeatherMate User Guide

WeatherMate is a small Ionic/Angular progressive web app that lets you look up the
current weather for any city, save cities you check often, and get the weather for
where you currently are.

## Getting Started

Clone the repository, then install dependencies and run the app:

```
npm install
ionic serve
```

The app will open in your browser at `http://localhost:8100`.

## Features

### Home tab
Type a city name into the search bar and press Search (or hit enter). A list of
matching cities is shown, since some city names exist in more than one country
(there's more than one "London"!). Tap a result to see the current temperature,
a short description of the conditions and the wind speed. From here you can tap
"Save to favourites" to keep that city for later.

### Favourites tab
Shows every city you've saved. Tap a city to load its current weather again.
Swipe a city left to reveal a delete button if you want to remove it. Favourites
are stored on the device using Ionic Storage, so they're still there the next
time you open the app.

### Location tab
Tap "Use my current location" and, after allowing location permission, the app
will fetch the weather for wherever you currently are using the device's GPS
(or the browser's location API when running as a PWA on desktop).

## How it works (architecture)

- **WeatherService** (`src/app/services/weather.service.ts`) talks to the free
  [Open-Meteo](https://open-meteo.com) API. It first looks up the city name to
  get coordinates (geocoding), then requests the current weather for those
  coordinates. Both calls return RxJS Observables using Angular's `HttpClient`.
- **FavouritesService** (`src/app/services/favourites.service.ts`) wraps
  `@ionic/storage-angular` to save and load the list of favourite city names.
- **Geolocation** is handled on the Location tab using the `@capacitor/geolocation`
  plugin, which works both on a mobile device and in a regular desktop browser.
- Navigation between the three tabs is handled by the Angular Router, configured
  in `src/app/tabs/tabs.routes.ts`.


