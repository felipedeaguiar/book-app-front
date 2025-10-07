import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedRoutingModule } from './feed-routing.module';
import { ListPage } from './pages/list/list.page';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [
    ListPage
  ],
  imports: [
    IonicModule,
    CommonModule,
    FeedRoutingModule
  ]
})
export class FeedModule { }
