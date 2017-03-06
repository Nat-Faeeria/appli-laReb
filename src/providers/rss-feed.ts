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
  length: number;

  constructor(title: string, pubDate: string, link: string, duration: string, author: string, audioLink: string, length: number){
    this.title = title;
    this.pubDate = pubDate;
    this.link = link;
    this.duration = duration;
    this.author = author;
    this.audioLink = audioLink;
    this.length = length;
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
          return new FeedItem(item.title, item.pubDate, item.link, this.parseTime(item.duration.__text), item.author.__text, item.enclosure._url, this.timeInSeconds(item.duration.__text));
        }));
  }

  parseTime(date: string) {
    let ret = "";
    date.split(":").map(sNumber => ret += parseInt(sNumber)===0 ? "" : parseInt(sNumber)+":");
    let tempTable = ret.split(":");
    ret.split(":")[tempTable.length]="0"+tempTable[tempTable.length];
    console.log("0"+tempTable[tempTable.length]);
    return ret.slice(0,-1);
  }

  timeInSeconds(time: string){
    let sum = 0;
    let timeTable = time.split(":");
    if (timeTable.length == 3) {
      sum += parseInt(timeTable[0]) * 36000;
      sum += parseInt(timeTable[1]) * 60;
      sum += parseInt(timeTable[2]);
    } else {
      sum += parseInt(timeTable[0]) * 60;
      sum += parseInt(timeTable[1]);
    }
    return sum;
  }

}
