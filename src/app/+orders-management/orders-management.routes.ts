import {
  Routes,
} from '@angular/router';

// Components
import {
  OrdersManagementComponent,
} from './orders-management.component';
import {
  OrdersMainComponent,
} from './orders-main';
import { OrdersEditComponent } from './orders-edit/orders-edit.component';
import { OrdersInfoComponent } from './orders-edit/info/info.component';
import { OrdersShippingInfoComponent } from './orders-edit/shipping-info/shipping-info.component';
import { OrdersItemComponent } from './orders-edit/item/item.component';

export const routes: Routes = [
  {
    path: '',
    component: OrdersManagementComponent,
    data: {
      className: 'orders-management',
    },
    children: [
      {
        path: '',
        redirectTo: 'main',
        pathMatch: 'full',
      },
      {
        path: 'main',
        component: OrdersMainComponent,
        data: {
          bodyClassName: 'orders-main',
        },
      },
      {
        path: ':id',
        children: [
          {
            path: '',
            redirectTo: 'edit',
            pathMatch: 'full',
          },
          {
            path: 'edit',
            component: OrdersEditComponent,
            data: {
              bodyClassName: 'orders-edit',
            },
            children: [
              {
                path: '',
                redirectTo: 'order-info',
                pathMatch: 'full',
              },
              {
                path: 'order-info',
                component: OrdersInfoComponent,
                data: {
                  bodyClassName: 'orders-info',
                }
              },
              {
                path: 'shipping-info',
                component: OrdersShippingInfoComponent,
                data: {
                  bodyClassName: 'shipping-info',
                }
              },
              {
                path: 'order-item',
                component: OrdersItemComponent,
                data: {
                  bodyClassName: 'order-item',
                }
              }
            ],
          },
        ],
      },
    ],
  },
];
