import {
  Routes
} from '@angular/router';

// Components
import {
  TopicsManagementComponent
} from './topics-management.component';
import {
  TopicsMainComponent
} from './topics-main';
import { TopicEditComponent } from './topics-edit/topics-edit.component';
import { TopicEditSeoComponent } from './topics-edit/seo/seo.component';
import { TopicEditInfoComponent } from './topics-edit/info/info.component';

export const routes: Routes = [
  {
    path: '',
    component: TopicsManagementComponent,
    data: {
      className: 'topics-management'
    },
    children: [
      {
        path: '',
        redirectTo: 'main',
        pathMatch: 'full'
      },
      {
        path: 'main',
        component: TopicsMainComponent,
        data: {
          bodyClassName: 'topics-main'
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
            component: TopicEditComponent,
            data: {
              bodyClassName: 'topics-edit'
            },
            children: [
              {
                path: '',
                redirectTo: 'topic-info',
                pathMatch: 'full'
              },
              {
                path: 'topic-info',
                component: TopicEditInfoComponent,
                data: {
                  bodyClassName: 'topics-edit-info'
                }
              },
              {
                path: 'topic-seo',
                component: TopicEditSeoComponent,
                data: {
                  bodyClassName: 'topics-edit-seo'
                }
              }
            ]
          }
        ]
      }
    ]
  }
];
