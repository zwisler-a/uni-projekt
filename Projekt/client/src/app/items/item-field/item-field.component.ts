import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { FieldType } from '../../models/field-type.enum';
import { ItemFormControl } from '../item-form-control';

/**
 * Wrapper to decide which kind of input should be shown for the item field.
 * Each type has its own component handling the specific logic of the input
 */
@Component({
    selector: 'app-item-field',
    templateUrl: './item-field.component.html',
    styleUrls: ['./item-field.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ItemFieldComponent implements OnInit {
    /** The field which should be displayed */
    @Input()
    control: ItemFormControl;

    @Input()
    form: FormGroup;

    constructor() {}

    ngOnInit() {}

    /** Pass enum to dom */
    get FieldType() {
        return FieldType;
    }
}
