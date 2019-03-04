import { Route } from '@angular/router';
import { DefaultPageComponent } from '../shared/default-page/default-page.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserDataPageComponent } from './user-data-page/user-data-page.component';
import { UserResolver } from './user-list/user.resolver';

export const userRoutes: Route[] = [
    {
        path: 'view',
        component: DefaultPageComponent,
        resolve: { user: UserResolver },
        children: [
            { path: '', component: UserListComponent, outlet: 'content' },
            { path: ':id', component: UserDetailComponent, outlet: 'detail' }
        ]
    },
    {
        path: 'me',
        component: UserDataPageComponent
    }
];