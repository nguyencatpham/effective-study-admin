import {
  Routes
} from '@angular/router';

// Components
import {
  CategoriesManagementComponent
} from './categories-management.component';
import {
  CategoriesMainComponent
} from './categories-main';
import {
  CategoriesEditComponent
} from './categories-edit';

export const routes: Routes = [
  {
    path: '',
    component: CategoriesManagementComponent,
    data: {
      className: 'categories-management'
    },
    children: [
      {
        path: '',
        redirectTo: 'main',
        pathMatch: 'full'
      },
      {
        path: 'main',
        component: CategoriesMainComponent,
        data: {
          bodyClassName: 'categories-main'
        }
      },
      {
        path: 'new',
        component: CategoriesEditComponent,
        data: {
          bodyClassName: 'categories-edit'
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
            component: CategoriesEditComponent,
            data: {
              bodyClassName: 'categories-edit'
            }
          }
        ]
      }
    ]
  }
];
