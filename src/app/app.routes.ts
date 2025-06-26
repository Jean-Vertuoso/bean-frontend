import { HomeComponent } from './pages/home/home.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { LoginComponent } from './pages/login/login.component';
import { NewProductComponent } from './pages/product/new-product/new-product.component';
import { FindProductComponent } from './pages/product/find-product/find-product.component';
import { NewClientComponent } from './pages/client/new-client/new-client.component';
import { FindClientComponent } from './pages/client/find-client/find-client.component';
import { NewSaleComponent } from './pages/sale/new-sale/new-sale.component';
import { FindSaleComponent } from './pages/sale/find-sale/find-sale.component';
import { AuthGuard } from './services/auth-guard.service';

export const routes: Routes = [
	{
		path: '',
    	component: MainLayoutComponent,
		//canActivate: [AuthGuard],
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
