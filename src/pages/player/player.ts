import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { MediaPlugin, MusicControls } from 'ionic-native';
import { FeedItem } from "../../providers/rss-feed";
import {Observable} from 'rxjs/Rx';
import { ViewController } from 'ionic-angular';


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
  track: FeedItem;
  index: number;
  public position: number;
  min: number;
  max: number;
  playing: boolean;
  private timer;
  private subscription;
  step: number;

  constructor(public navCtrl: NavController, private navParams: NavParams, private http: Http, public viewCtrl: ViewController) {
    /*this.http.get(this.navParams.get("audioLink")).map(res => {
     let contentType = res.headers.get("content-type");
     return new Blob([(<any> res)._body], {type: contentType})
     }).subscribe(res => {
     this.audio = res;
     console.log(this.audio)
     });*/
    this.index = this.navParams.get("index");
    this.tracks = this.navParams.get("tracks");
    this.min = 0;
    this.position= 0;
    this.initializeMedia();
    this.viewCtrl.willLeave.subscribe(()=>{if(this.subscription!=null){this.subscription.unsubscribe()}});
  }

  generateMusicControls(track: FeedItem) {
    MusicControls.create({
      track       : track.title,
      artist      : track.author,
      cover       : '',
      isPlaying   : true,
      dismissable : true,
      hasPrev   : !!this.tracks[this.index+1],
      hasNext   : !!this.tracks[this.index-1],
      hasClose  : true,
      ticker    : 'Now playing '+track.title
    });
    MusicControls.subscribe().subscribe(action => {
      switch (action) {
        case 'music-controls-next':
          this.media.release();
          this.playing = false;
          this.index -= 1;
          this.initializeMedia();
          this.playMedia();
          break;
        case 'music-controls-previous':
          this.media.release();
          this.playing = false;
          this.index += 1;
          this.initializeMedia();
          this.playMedia();
          break;
        case 'music-controls-pause':
          this.pauseMedia();
          break;
        case 'music-controls-play':
          this.playMedia()
          break;
        case 'music-controls-destroy':
          this.pauseMedia();
          MusicControls.destroy();
          break;

        // Headset events (Android only)
        case 'music-controls-media-button' :
          this.playing = !this.playing;

          if (this.playing) {
            this.media.play();
            MusicControls.updateIsPlaying(this.playing);
          } else {
            this.media.pause();
            MusicControls.updateIsPlaying(this.playing);
          }
          break;
        case 'music-controls-headset-unplugged':
          this.pauseMedia();
          break;
        case 'music-controls-headset-plugged':
          this.playMedia();
          break;
        default:
          this.pauseMedia();
          break;
      }
    });
    MusicControls.listen();
  }

  initializeMedia() {
    this.track = this.tracks[this.index];
    this.media = new MediaPlugin(this.track.audioLink);
    this.max = this.track.length;
    console.log(this.max);
  }

  playMedia(){
    if (this.playing){
      this.pauseMedia();
    }
    if (!this.playing) {
      this.timer = Observable.timer(2000, 1000);
      this.subscription = this.timer.subscribe(() => {
        this.media.getCurrentPosition().then(value => {
          this.position = value;
        });
      });
    }
    this.media.play({numberOfLoops: 1,playAudioWhenScreenIsLocked: true});
    this.playing = true;
    this.generateMusicControls(this.track);
    MusicControls.updateIsPlaying(this.playing);
  }

  pauseMedia(){
    this.media.pause();
    this.subscription.unsubscribe();
    this.playing = false;
    MusicControls.updateIsPlaying(this.playing);
  }

  moveTo(){
    console.log("change");
  }

}
