import { Component, OnInit } from '@angular/core';
import { Profile } from '../profile/profile.page';
import { ApolloService } from '../services/apollo.service';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { Tag } from '../shared/tags/tags.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {

  constructor(
    private apolloService: ApolloService,
    private activatedRoutes: ActivatedRoute,
    private storage: StorageService
  ) { }

  profile: Profile
  loading = true;
  interests: Array<Tag> = Array();

  async ngOnInit() {
    console.log("entered user profile");
    this.loading = true;
    let userId: string;
    this.activatedRoutes.params.subscribe(params => {
      userId = params["id"];
    });
    console.log(userId, typeof userId);
    this.profile = await this.apolloService.getProfile(
      userId
    );

    this.interests = this.profile.interests;

    console.log(this.profile);

    this.loading = false;
  }


}
