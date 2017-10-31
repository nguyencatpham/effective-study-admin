import {
  Routes
} from '@angular/router';

// Components
import {
  ProductsManagementComponent
} from './products-management.component';
import {
  ProductsMainComponent
} from './products-main';
import {
  ProductsEditComponent
} from './products-edit';
import {
  ProductsEditInfoComponent
} from './products-edit/info';
import {
  ProductsEditPictureComponent
} from './products-edit/picture';
import { ProductsEditComponentComponent } from './products-edit/component/component.component';
import { ProductsEditNutritionComponent } from './products-edit/nutrition/nutrition.component';
import { ProductsEditSeoComponent } from './products-edit/seo/seo.component';

export const routes: Routes = [
  {
    path: '',
    component: ProductsManagementComponent,
    data: {
      className: 'products-management'
    },
    children: [
      {
        path: '',
        redirectTo: 'main',
        pathMatch: 'full'
      },
      {
        path: 'main',
        component: ProductsMainComponent,
        data: {
          bodyClassName: 'products-main'
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
            component: ProductsEditComponent,
            data: {
              bodyClassName: 'products-edit'
            },
            children: [
              {
                path: '',
                redirectTo: 'product-info',
                pathMatch: 'full'
              },
              {
                path: 'product-info',
                component: ProductsEditInfoComponent,
                data: {
                  bodyClassName: 'products-edit-info'
                }
              },
              {
                path: 'product-picture',
                component: ProductsEditPictureComponent,
                data: {
                  bodyClassName: 'products-edit-picture'
                }
              },
              {
                path: 'product-component',
                component: ProductsEditComponentComponent,
                data: {
                  bodyClassName: 'products-edit-component'
                }
              },
              {
                path: 'product-nutrition',
                component: ProductsEditNutritionComponent,
                data: {
                  bodyClassName: 'products-edit-nutrition'
                }
              },
              {
                path: 'product-seo',
                component: ProductsEditSeoComponent,
                data: {
                  bodyClassName: 'products-edit-seo'
                }
              }
            ]
          }
        ]
      }
    ]
  }
];
