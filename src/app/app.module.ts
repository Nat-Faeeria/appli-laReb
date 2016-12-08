import {NgModule, ErrorHandler} from '@angular/core';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {MyApp} from './app.component';
import {PodcastsPage} from "../pages/podcasts/podcasts";
import {PlayerPage} from "../pages/player/player";
import {RssFeed} from "../providers/rss-feed";

@NgModule({
    declarations: [
        MyApp,
        PodcastsPage,
        PlayerPage
    ],
    imports: [
        IonicModule.forRoot(MyApp)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        PodcastsPage,
        PlayerPage
    ],
    providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, RssFeed]
})
export class AppModule {
}
