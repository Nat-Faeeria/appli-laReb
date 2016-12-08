import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {RssFeed, FeedItem} from "../../providers/rss-feed"
import {PlayerPage} from "../player/player"

/*
  Generated class for the Podcasts page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-podcasts',
  templateUrl: 'podcasts.html'
})
export class PodcastsPage {

  podcasts: FeedItem[];

  constructor(public navCtrl: NavController, private rssFeed: RssFeed) {
    this.rssFeed.load().subscribe(podcasts => { this.podcasts=podcasts } );
  }

  goToPlayer(tracks: FeedItem[], index: number){
    console.log(index);
    this.navCtrl.push(PlayerPage, {tracks, index})
  }

}
