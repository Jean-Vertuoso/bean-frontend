import { Component } from '@angular/core';
import { NavbarComponent } from "../../navbar/navbar.component";
import { RouterOutlet } from '@angular/router';

@Component({
	standalone: true,
	selector: 'app-main-layout',
	imports: [
		NavbarComponent,
		RouterOutlet]
	,
	templateUrl: './main-layout.component.html',
	styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {

}
