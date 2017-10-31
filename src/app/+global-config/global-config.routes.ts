import {
  Routes
} from '@angular/router';

// Components
import {
  GlobalConfigComponent
} from './global-config.component';
import {
  GlobalConfigMainComponent
} from './global-config-main';
import {
  GlobalConfigEditComponent
} from './global-config-edit';

export const routes: Routes = [
  {
    path: '',
    component: GlobalConfigComponent,
    data: {
      className: 'global-config'
    },
    children: [
      {
        path: '',
        redirectTo: 'main',
        pathMatch: 'full'
      },
      {
        path: 'main',
        component: GlobalConfigMainComponent,
        data: {
          bodyClassName: 'global-config-main'
        }
      },
      {
        path: 'new',
        component: GlobalConfigEditComponent,
        data: {
          bodyClassName: 'global-config-new'
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
            component: GlobalConfigEditComponent,
            data: {
              bodyClassName: 'global-config-edit'
            }
          }
        ]
      }
    ]
  }
];
