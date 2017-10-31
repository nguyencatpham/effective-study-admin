import {
  Routes
} from '@angular/router';

// Components
import {
  ShippingsManagementComponent
} from './shippings-management.component';
import {
  ShippingsMainComponent
} from './shippings-main';
import {
  ShippingEditComponent
} from './shippings-edit';

export const routes: Routes = [
  {
    path: '',
    component: ShippingsManagementComponent,
    data: {
      className: 'shippings-management'
    },
    children: [
      {
        path: '',
        redirectTo: 'main',
        pathMatch: 'full'
      },
      {
        path: 'main',
        component: ShippingsMainComponent,
        data: {
          bodyClassName: 'shippings-main'
        }
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
            component: ShippingEditComponent,
            data: {
              bodyClassName: 'shippings-edit'
            }
          }
        ]
      }
    ]
  }
];
