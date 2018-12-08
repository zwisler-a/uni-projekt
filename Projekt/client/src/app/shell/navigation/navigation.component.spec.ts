import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatToolbarModule,
    MatListModule
} from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';

import { RouterLoadingIndicatorComponent } from '../router-loading-indicator/router-loading-indicator.component';
import { NavigationComponent } from './navigation.component';
import { NavigationService } from './navigation.service';
import { SidenavControlButtonComponent } from './sidenav-control-button/sidenav-control-button.component';
import { NavigationGroupComponent } from './navigation-group/navigation-group.component';

describe('NavigationComponent', () => {
    let component: NavigationComponent;
    let fixture: ComponentFixture<NavigationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                NavigationComponent,
                RouterLoadingIndicatorComponent,
                SidenavControlButtonComponent,
                NavigationGroupComponent
            ],
            imports: [
                RouterTestingModule,
                MatProgressBarModule,
                MatToolbarModule,
                MatIconModule,
                MatButtonModule,
                FlexLayoutModule,
                MatListModule
            ],
            providers: [NavigationService]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NavigationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should create the ngClass object properly', () => {
        component.collapseSidenav();
        expect(component.sidenavCssState.collapsed).toBeTruthy();
        component.expandSidenav();
        expect(component.sidenavCssState.collapsed).toBeFalsy();
        expect(component.sidenavCssState.expanded).toBeTruthy();
        component.hideSidenav();
        expect(component.sidenavCssState.expanded).toBeFalsy();
        expect(component.sidenavCssState.hidden).toBeTruthy();
    });

    it('should determine the state properly on md', () => {
        const isActive = query => query === 'md';
        component.determineNavigationState(isActive);
        expect(component.sidenavIsCollapsed).toBe(true);
        expect(component.sidenavIsSide).toBe(true);
    });

    it('should determine the state properly on lt-md', () => {
        const isActive = query => query === 'lt-md';
        component.determineNavigationState(isActive);
        expect(component.sidenavIsHidden).toBe(true);
        expect(component.sidenavIsOver).toBe(true);
    });

    it('should determine the state properly on gt-md', () => {
        const isActive = query => query === 'gt-md';
        component.determineNavigationState(isActive);
        expect(component.sidenavIsExpanded).toBe(true);
        expect(component.sidenavIsSide).toBe(true);
    });
});
