import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { MediaPlugin, MusicControls } from 'ionic-native';
import { FeedItem } from "../../providers/rss-feed"


/*
  Generated class for the Player page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-player',
  templateUrl: 'player.html'
})
export class PlayerPage {

  audio: any;
  media: MediaPlugin;
  tracks: FeedItem[];
  index: number;

  constructor(public navCtrl: NavController, private navParams: NavParams, private http: Http) {
    /*this.http.get(this.navParams.get("audioLink")).map(res => {
      let contentType = res.headers.get("content-type");
      return new Blob([(<any> res)._body], {type: contentType})
    }).subscribe(res => {
      this.audio = res;
      console.log(this.audio)
    });*/
    this.index = this.navParams.get("index");
    this.tracks = this.navParams.get("tracks");
    let track = this.tracks[this.index];
    console.log("yo");
    console.log(this.index);
    this.media = new MediaPlugin(track.audioLink);
    let playing = false;

    MusicControls.create({
      track       : track.title,
      artist      : track.author,
      cover       : '',
      isPlaying   : true,
      dismissable : true,
      hasPrev   : !!this.tracks[this.index-1],
      hasNext   : !!this.tracks[this.index+1],
      hasClose  : true,
      ticker    : 'Now playing '+track.title
    });

    MusicControls.subscribe().subscribe(action => {

      switch(action) {
        case 'music-controls-next':
          this.index += 1;
          this.media = new MediaPlugin(this.tracks[this.index].audioLink);
          this.media.play();
          playing = true;
          break;
        case 'music-controls-previous':
          this.index -= 1;
          this.media = new MediaPlugin(this.tracks[this.index].audioLink);
          this.media.play();
          playing = true;
          break;
        case 'music-controls-pause':
          this.media.pause();
          playing = false;
          MusicControls.updateIsPlaying(playing);
          break;
        case 'music-controls-play':
          this.media.play();
          playing = true;
          MusicControls.updateIsPlaying(playing);
          break;
        case 'music-controls-destroy':
          this.media.release();
          MusicControls.destroy();
          break;

        // Headset events (Android only)
        case 'music-controls-media-button' :
          playing = !playing;

          if (playing) {
            this.media.play();
            MusicControls.updateIsPlaying(playing);
          } else {
            this.media.pause();
            MusicControls.updateIsPlaying(playing);
          }
          break;
        case 'music-controls-headset-unplugged':
          this.media.pause();
          playing = false;
          MusicControls.updateIsPlaying(playing);
          break;
        case 'music-controls-headset-plugged':
          this.media.play();
          playing = true;
          MusicControls.updateIsPlaying(playing);
          break;
        default:
          break;
      }

    });

    MusicControls.listen();

    MusicControls.updateIsPlaying(true);
  }

}
