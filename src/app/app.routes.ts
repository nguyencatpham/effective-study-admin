import {
    Routes,
    RouterModule
} from '@angular/router';
import { AuthGuard } from './shared/services/auth-guard';
import { ResetGuard } from './shared/services/reset-guard';
import { AuthLayoutComponent } from './shared/containers/auth-layout-container';
import { MainLayoutComponent } from './shared/containers/main-layout-container';
import { SignInComponent } from './sign-in';
import { NotFoundComponent } from './not-found';

export const ROUTES: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                loadChildren: './+dashboard/dashboard.module#DashboardModule'
            },
            {
                path: 'products-management',
                loadChildren: './+products-management/products-management.module#ProductsManagementModule'
            },
            {
                path: 'users-management',
                loadChildren: './+user-management/user-management.module#UserManagementModule'
            },
            {
                path: 'menus-management',
                loadChildren: './+menus-management/menus-management.module#MenusManagementModule'
            },
            {
                path: 'categories-management',
                loadChildren: './+categories-management/categories-management.module#CategoriesManagementModule'
            },
            {
                path: 'components-management',
                loadChildren: './+components-management/components-management.module#ComponentsManagementModule'
            },
            {
                path: 'nutritions-management',
                loadChildren: './+nutritions-management/nutritions-management.module#NutritionsManagementModule'
            },
            {
                path: 'orders-management',
                loadChildren: './+orders-management/orders-management.module#OrdersManagementModule'
            },
            {
                path: 'shippings-management',
                loadChildren: './+shippings-management/shippings-management.module#ShippingsManagementModule'
            },
            {
                path: 'global-config',
                loadChildren: './+global-config/global-config.module#GlobalConfigModule'
            },
            {
                path: 'topics-management',
                loadChildren: './+topics-management/topics-management.module#TopicsManagementModule'
            },
            {
                path: 'profile',
                loadChildren: './profile/profile.module#ProfileModule'
            }
        ]
    },
    {
        path: 'auth',
        component: AuthLayoutComponent,
        children: [
            {
                path: '',
                redirectTo: 'sign-in',
                pathMatch: 'full'
            },
            {
                path: 'sign-in',
                component: SignInComponent
            },
            {
                path: 'sign-up',
                loadChildren: './+sign-up/sign-up.module#SignUpModule'
            },
            {
                path: 'forgot-password',
                loadChildren: './+forgot-password/forgot-password.module#ForgotPasswordModule'
            },
            {
                path: 'reset-password/:id/:code',
                loadChildren: './+reset-password/reset-password.module#ResetPasswordModule',
                canActivate: [ResetGuard]
            }
        ]
    },
    {
        path: '**',
        component: NotFoundComponent
    }
];
