import { AuthGuardService } from './core/guards/auth-guard.service';
import { HomeComponent } from './home/home.component';
import { MainLayoutComponent } from './shared/components/layout/main-layout/main-layout.component';
import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './shared/components/layout/auth-layout/auth-layout.component';
import { LoginComponent } from './features/auth/login/login.component';
import { NewProductComponent } from './features/product/new-product/new-product.component';
import { FindProductComponent } from './features/product/find-product/find-product.component';
import { NewClientComponent } from './features/client/new-client/new-client.component';
import { FindClientComponent } from './features/client/find-client/find-client.component';
import { NewSaleComponent } from './features/sale/new-sale/new-sale.component';
import { FindSaleComponent } from './features/sale/find-sale/find-sale.component';

export const routes: Routes = [
	{
		path: '',
    	component: MainLayoutComponent,
		//canActivate: [AuthGuardService],
		children: [
			{ path: 'home', component: HomeComponent},
			{ path: 'client/new', component: NewClientComponent},
			{ path: 'client/find', component: FindClientComponent},
			{ path: 'sale/new', component: NewSaleComponent},
			{ path: 'sale/find', component: FindSaleComponent},
			{ path: 'product/new', component: NewProductComponent },
			{ path: 'product/find', component: FindProductComponent },
		]
	},
	{
		path: '',
    	component: AuthLayoutComponent,
		children: [
			{ path: 'login', component: LoginComponent}
		]
	},
	{ path: '**', redirectTo: 'login'}
];
