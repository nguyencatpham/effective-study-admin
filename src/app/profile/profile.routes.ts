import { Routes } from "@angular/router";
import { ProfileComponent } from "./profile.component";
import { ProfileInfoComponent } from "./info/info.component";
import { ProfileChefComponent } from "./chef/chef.component";
import { ProfileRatingComponent } from "./rating/rating.component";

export const routes: Routes = [
    {
        path: '',
        component: ProfileComponent,
        data: {
            pageTitile: 'Profile',
            className: 'profile'
        },
        children: [
            {
                path: '',
                redirectTo: 'info',
                pathMatch: 'full'
            },
            {
                path: 'info',
                component: ProfileInfoComponent,
                data: {
                    pageTitile: 'Profile Info',
                    className: 'profile-info'
                }
            },
            {
                path: 'chef',
                component: ProfileChefComponent,
                data: {
                    pageTitile: 'Profile Chef Info',
                    className: 'profile-chef'
                }
            },
            {
                path: 'ratings',
                component: ProfileRatingComponent,
                data: {
                    pageTitile: 'Profile Ratings',
                    className: 'profile-ratings'
                }
            }
        ]
    }
];