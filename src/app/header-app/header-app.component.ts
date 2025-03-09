import {Component, Input, OnInit} from '@angular/core';
import { MenuController } from '@ionic/angular';
@Component({
  selector: 'app-header-app',
  templateUrl: './header-app.component.html',
  styleUrls: ['./header-app.component.scss'],
})
export class HeaderAppComponent  implements OnInit {
  @Input() nome: string = '';
  constructor(private menuController: MenuController) { }

  ngOnInit() {}

  openMenu() {
    this.menuController.toggle('main-menu'); // Abre ou fecha o menu
  }
}
