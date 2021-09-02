import { Component, OnInit } from '@angular/core';
import { ApolloService } from "src/app/services/apollo.service";
import { StorageService } from "src/app/services/storage.service";
import { AuthenticationService } from "../services/authentication.service";
import { Router } from "@angular/router";
import { CompactEvent } from '../feed/feed.page';

export interface Favorites {
  favorites: Array<CompactEvent>;
}

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage implements OnInit {

  favorites: Array<CompactEvent> = Array()

  constructor(
    private apolloService: ApolloService,
    private storage: StorageService,
    private router: Router) { }

  ngOnInit() {
    this.getFavorites()
  }

  async getFavorites() {
    try {
      const authInfo = await this.storage.getAuthInfo();

      this.favorites = await this.apolloService.getFavorites(authInfo.id);

      console.log(this.favorites);

    } catch (e) {
      console.log("caught error - " + e);
    }
  }

  goToEventDetails(id) {
    this.router.navigate([
      `members/event-details/${id}`
    ]);
  }

}
