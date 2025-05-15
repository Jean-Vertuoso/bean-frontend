import { HomeComponent } from './pages/home/home.component';
import { ProductComponent } from './pages/product/product.component';
import { SaleComponent } from './pages/sale/sale.component';
import { ClientComponent } from './pages/client/client.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { Routes } from '@angular/router';
import { UserComponent } from './pages/user/user.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
	{
		path: '',
    	component: MainLayoutComponent,
		children: [
			{ path: 'home', component: HomeComponent},
			{ path: 'user', component: UserComponent},
			{ path: 'client', component: ClientComponent},
			{ path: 'sale', component: SaleComponent},
			{ path: 'product', component: ProductComponent },
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
