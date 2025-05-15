import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { NavbarButtonComponent } from "../navbar-button/navbar-button.component";
import { DropdownItemComponent } from "../dropdown-item/dropdown-item.component";

@Component({
  selector: 'app-navbar',
  imports: [
    NavbarButtonComponent,
    RouterModule,
    DropdownItemComponent
],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

}
