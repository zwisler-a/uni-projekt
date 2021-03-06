import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatTooltipModule
} from '@angular/material';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { CompanyStoreModule } from '../company/_company-store/company-store.module';
import { ConfirmDialogModule } from '../shared/confirm-dialog/confirm-dialog.module';
import { DefaultPageModule } from '../shared/default-page/default-page.module';
import { NavigateBackModule } from '../shared/navigate-back/navigate-back.module';
import { AddUserComponent } from './add-user/add-user.component';
import { userRoutes } from './user.routes';
import { UserDataPageComponent } from './user-data-page/user-data-page.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserStoreModule } from './_user-store/user-store.module';
import { RoleSelectorComponent } from './role-selector/role-selector.component';
import { RolesStoreModule } from '../roles/_roles-store/roles-store.module';

@NgModule({
    declarations: [UserListComponent, UserDetailComponent, UserDataPageComponent, AddUserComponent, RoleSelectorComponent],
    imports: [
        CommonModule,
        DefaultPageModule,
        RouterModule.forChild(userRoutes),
        UserStoreModule.forChild(),
        RolesStoreModule.forChild(),
        RolesStoreModule,
        MatListModule,
        MatIconModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatChipsModule,
        MatInputModule,
        MatAutocompleteModule,
        ReactiveFormsModule,
        TranslateModule,
        MatSnackBarModule,
        FormsModule,
        MatTooltipModule,
        ReactiveFormsModule,
        ConfirmDialogModule,
        FlexLayoutModule,
        NavigateBackModule,
        MatButtonModule,
        FlexLayoutModule,
        ConfirmDialogModule,
        MatToolbarModule,
        CompanyStoreModule
    ],
    providers: []
})
export class UserModule {}
