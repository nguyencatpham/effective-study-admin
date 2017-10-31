import {
  Routes
} from '@angular/router';

// Components
import {
  ComponentsManagementComponent
} from './components-management.component';
import {
  ComponentsMainComponent
} from './components-main';
import {
  ComponentEditComponent
} from './components-edit';

export const routes: Routes = [
  {
    path: '',
    component: ComponentsManagementComponent,
    data: {
      className: 'components-management'
    },
    children: [
      {
        path: '',
        redirectTo: 'main',
        pathMatch: 'full'
      },
      {
        path: 'main',
        component: ComponentsMainComponent,
        data: {
          bodyClassName: 'components-main'
        }
      },
      {
        path: 'new',
        component: ComponentEditComponent,
        data: {
          bodyClassName: 'components-edit'
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
            component: ComponentEditComponent,
            data: {
              bodyClassName: 'components-edit'
            }
          }
        ]
      }
    ]
  }
];
