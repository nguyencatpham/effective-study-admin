import {
  Routes
} from '@angular/router';

import {
  UserManagementComponent
} from './user-management.component';

import {
  UserMainComponent
} from './user-main';
import {
  NewUserComponent
} from './new-user/new-user.component';
import {
  EditUserComponent
} from './edit-user/edit-user.component';
import {
  UserProfileComponent
} from './user-profile/user-profile.component';
import { EditUserInfoComponent } from './edit-user/info/info.component';
import { EditChefInfoComponent } from './edit-user/chef/chef.component';
import { EditChefRatingComponent } from './edit-user/rating/rating.component';

export const routes: Routes = [
  {
    path: '',
    component: UserManagementComponent,
    data: {
      pageTitle: 'User Management',
      className: 'user-management'
    },
    children: [
      {
        path: '',
        redirectTo: 'main',
        pathMatch: 'full'
      },
      {
        path: 'main',
        component: UserMainComponent,
        data: {className: 'user-main'}
      },
      {
        path: 'profile',
        component: UserProfileComponent,
        data: {className: 'user-profile'}
      },
      {
        path: 'new',
        component: NewUserComponent,
        data: {className: 'new-user'}
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
            component: EditUserComponent,
            data: {className: 'edit-user'},
            children: [
              {
                path: '',
                redirectTo: 'user-info',
                pathMatch: 'full'
              },
              {
                path: 'user-info',
                component: EditUserInfoComponent,
                data: {
                  bodyClassName: 'user-info'
                }
              },
              {
                path: 'chef-info',
                component: EditChefInfoComponent,
                data: {
                  bodyClassName: 'chef-info'
                }
              },
              {
                path: 'rating-info',
                component: EditChefRatingComponent,
                data: {
                  bodyClassName: 'rating-info'
                }
              }
            ]
          }
        ]
      }
    ]
  }
];
