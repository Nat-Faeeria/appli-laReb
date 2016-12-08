import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as x2json from "x2json";

export class FeedItem {
  title: string;
  pubDate: string;
  link: string;
  duration: string;
  author: string;
  audioLink: string;

  constructor(title: string, pubDate: string, link: string, duration: string, author: string, audioLink: string){
    this.title = title;
    this.pubDate = pubDate;
    this.link = link;
    this.duration = duration;
    this.author = author;
    this.audioLink = audioLink;
  }
}

/*
  Generated class for the RssFeed provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class RssFeed {

  podcastsAPIUrl = "http://feeds.soundcloud.com/users/soundcloud:users:147710348/sounds.rss";


  constructor(private http: Http) {}

  load() {
    return this.http.get(this.podcastsAPIUrl)
        .map(res => {
          let parser = new x2json.X2JS();
          return parser.xml_str2json(res.text()).rss.channel.item;
        }).map(data => data.map(item => {
          return new FeedItem(item.title, item.pubDate, item.link, this.parseTime(item.duration.__text), item.author.__text, item.enclosure._url);
        }));
  }

  parseTime(date: string) {
    let ret = "";
    date.split(":").map(sNumber => ret += parseInt(sNumber)===0 ? "" : parseInt(sNumber)+":");
    return ret.slice(0,-1);
  }

}
