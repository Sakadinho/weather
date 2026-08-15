import { Injectable, inject } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

const FAVOURITES_KEY = 'favouriteCities';

@Injectable({ providedIn: 'root' })
export class FavouritesService {
  private storage = inject(Storage);
  private storageReady = false;

  private async ensureReady() {
    if (!this.storageReady) {
      await this.storage.create();
      this.storageReady = true;
    }
  }

  async getFavourites(): Promise<string[]> {
    await this.ensureReady();
    const list = await this.storage.get(FAVOURITES_KEY);
    return list || [];
  }

  async addFavourite(city: string): Promise<void> {
    const list = await this.getFavourites();
    if (!list.includes(city)) {
      list.push(city);
      await this.storage.set(FAVOURITES_KEY, list);
    }
  }

  async removeFavourite(city: string): Promise<void> {
    const list = await this.getFavourites();
    const updated = list.filter((c) => c !== city);
    await this.storage.set(FAVOURITES_KEY, updated);
  }
}
