import {
  Routes
} from '@angular/router';

// Components
import {
  MenusManagementComponent
} from './menus-management.component';
import {
  MenusMainComponent
} from './menus-main';
import {
  MenusEditComponent
} from './menus-edit';
import {
  MenusInfoComponent
} from './menus-edit/Info/info.component';
import { MenusProductComponent } from './menus-edit/Product/product.component';

export const routes: Routes = [
  {
    path: '',
    component: MenusManagementComponent,
    data: {
      className: 'menus-management'
    },
    children: [
      {
        path: '',
        redirectTo: 'main',
        pathMatch: 'full'
      },
      {
        path: 'main',
        component: MenusMainComponent,
        data: {
          bodyClassName: 'menus-main'
        }
      },
      {
        path: 'new',
        data: {
          bodyClassName: 'menus-edit'
        },
        children: [
          {
            path: '',
            redirectTo: 'menus-info',
            pathMatch: 'full'
          },
          {
            path: 'menus-info',
            component: MenusInfoComponent,
            data: {
              bodyClassName: 'menus-info'
            }
          }
        ]
      },
      {
        path: ':id',
        children: [
          {
            path: '',
            redirectTo: 'edit',
            pathMatch: 'full'
          },
          {
            path: 'edit',
            component: MenusEditComponent,
            data: {
              bodyClassName: 'menus-edit'
            },
            children: [
              {
                path: '',
                redirectTo: 'menus-info',
                pathMatch: 'full'
              },
              {
                path: 'menus-info',
                component: MenusInfoComponent,
                data: {
                  bodyClassName: 'menus-info'
                }
              }, {
                path: 'menus-product',
                component: MenusProductComponent,
                data: {
                  bodyClassName: 'menus-product'
                }
              }
            ]
          }
        ]
      }
    ]
  }
];
