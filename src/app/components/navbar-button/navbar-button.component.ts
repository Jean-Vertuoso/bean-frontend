import { NavigationEnd, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, Input, TemplateRef, OnDestroy, Output, EventEmitter } from '@angular/core';
import { DropdownComponent } from "../dropdown/dropdown.component";
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar-button',
  imports: [
	DropdownComponent,
	CommonModule
	],
  templateUrl: './navbar-button.component.html',
  styleUrl: './navbar-button.component.scss'
})
export class NavbarButtonComponent implements OnDestroy {

	@Input() label: string = "";
	@Input() src: string = "";
	@Input() contentTpl!: TemplateRef<any>;
	@Input() open = false;
	@Output() toggle = new EventEmitter<void>();
	private routerSubscription: Subscription;

	constructor(private router: Router) {
		this.routerSubscription = this.router.events.pipe(
			filter(event => event instanceof NavigationEnd)
		).subscribe(() => {
			if(this.open){
				this.toggle.emit();
			}
		});
	}

	ngOnDestroy() {
		this.routerSubscription.unsubscribe();
	}

	onToggle(){
		this.toggle.emit();
	}
}
