import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatDetailPagePageRoutingModule } from './chat-detail-page-routing.module';

import { ChatDetailPagePage } from './chat-detail-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatDetailPagePageRoutingModule
  ],
  declarations: [ChatDetailPagePage]
})
export class ChatDetailPagePageModule {}
