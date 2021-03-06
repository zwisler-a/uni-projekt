import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule, MatInputModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateTestingModule } from 'ngx-translate-testing';

import { ItemFormControl } from '../../item-form-control';
import { ItemFieldNumberComponent } from './item-field-number.component';

describe('ItemFieldNumberComponent', () => {
    let component: ItemFieldNumberComponent;
    let fixture: ComponentFixture<ItemFieldNumberComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ItemFieldNumberComponent],
            imports: [
                MatInputModule,
                ReactiveFormsModule,
                FlexLayoutModule,
                MatIconModule,
                NoopAnimationsModule,
                TranslateTestingModule.withTranslations({})
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ItemFieldNumberComponent);
        component = fixture.componentInstance;
        component.control = ItemFormControl.fromField({
            id: 0,
            name: 'test',
            required: false,
            unique: false,
            displayValue: '',
            type: 'boolean',
            value: ''
        });
        component.form = new FormGroup({
            test: component.control
        });
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
