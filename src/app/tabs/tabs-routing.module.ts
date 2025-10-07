import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import {AuthGuard} from "../auth.guard";

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadChildren: () => import('../tab1/tab1.module').then(m => m.Tab1PageModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'conversations',
        loadChildren: () => import('../chat/chat.module').then(m => m.ChatModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'feed',
        loadChildren: () => import('../feed/feed.module').then(m => m.FeedModule),
        canActivate: [AuthGuard],
      },
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
