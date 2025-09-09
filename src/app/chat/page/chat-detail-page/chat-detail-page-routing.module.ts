import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatDetailPagePage } from './chat-detail-page.page';

const routes: Routes = [
  {
    path: '',
    component: ChatDetailPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatDetailPagePageRoutingModule {}
