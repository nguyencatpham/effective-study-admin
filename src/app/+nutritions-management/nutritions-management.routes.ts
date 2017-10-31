import {
  Routes
} from '@angular/router';

// Components
import {
  NutritionsManagementComponent
} from './nutritions-management.component';
import {
  NutritionsMainComponent
} from './nutritions-main';
import {
  NutritionEditComponent
} from './nutritions-edit';

export const routes: Routes = [
  {
    path: '',
    component: NutritionsManagementComponent,
    data: {
      className: 'nutritions-management'
    },
    children: [
      {
        path: '',
        redirectTo: 'main',
        pathMatch: 'full'
      },
      {
        path: 'main',
        component: NutritionsMainComponent,
        data: {
          bodyClassName: 'nutritions-main'
        }
      },
      {
        path: 'new',
        component: NutritionEditComponent,
        data: {
          bodyClassName: 'topics-edit'
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
            component: NutritionEditComponent,
            data: {
              bodyClassName: 'topics-edit'
            }
          }
        ]
      }
    ]
  }
];
