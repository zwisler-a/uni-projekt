import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatAutocompleteTrigger } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EmbeddedItems } from 'src/app/models/api/embedded-items.interface';
import { TypeField } from 'src/app/models/type-field.interface';
import { Type } from 'src/app/models/type.interface';
import { TypeSelectEvent } from 'src/app/shared/type-selector/type-selector-event.interface';
import { TypesService } from 'src/app/types/_type-store/types.service';

import { ItemService } from '../_item-store/item.service';
import { ItemFormControl } from '../item-form-control';
import { ItemFormGroup } from '../item-form-group';
import { ItemFieldReferenceService } from '../item-field/item-field-reference/item-field-reference.service';
import { GlobalFieldsService } from '../../types/_global-field-store/global-fields.service';
import { FormGroup } from '@angular/forms';
import { ApiItemField } from 'src/app/models/api/api-item.interface';

/**
 * UI to create an new Item
 */
@Component({
    selector: 'app-add-item',
    templateUrl: './add-item.component.html',
    styleUrls: ['./add-item.component.scss']
})
export class AddItemComponent implements OnInit, OnDestroy {
    typeSub: Subscription;
    @ViewChild(MatAutocompleteTrigger)
    autocompleteTrigger: MatAutocompleteTrigger;
    form: ItemFormGroup = new ItemFormGroup(-1, -1, {});

    globalControls: { [key: string]: ItemFormControl };
    globalForm: FormGroup;

    constructor(
        private itemService: ItemService,
        private typeService: TypesService,
        private refFieldService: ItemFieldReferenceService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private globalFieldService: GlobalFieldsService
    ) {}

    ngOnInit() {
        // restore state if its in a selection process
        if (this.refFieldService.isSelecting) {
            this.form = this.refFieldService.restoreState();
        }
        this.globalFieldService.fields.subscribe(fields => this.createGlobalFormControls(fields));
    }

    ngOnDestroy(): void {
        if (this.typeSub) {
            this.typeSub.unsubscribe();
        }
    }

    /** Sends a request to add the new item */
    submit() {
        const item: ApiItemField[] = Object.keys(this.form.controls).map(key => {
            const ctrl = this.form.controls[key] as ItemFormControl;
            return { id: ctrl.id, value: ctrl.value, global: ctrl.global || false };
        });
        const globalFields: ApiItemField[] = Object.keys(this.globalControls).map(key => {
            const ctrl = this.globalControls[key] as ItemFormControl;
            return { id: ctrl.id, value: ctrl.value, global: ctrl.global };
        });
        item.push(...globalFields);
        this.itemService.createItem(this.form.typeId, item).subscribe((res: EmbeddedItems) => {
            // redirect to details of the newly created item
            this.router.navigate(
                [
                    '/items',
                    'view',
                    {
                        outlets: {
                            detail: ['details', res.items[0].typeId, res.items[0].id]
                        }
                    }
                ],
                {
                    relativeTo: this.activatedRoute
                }
            );
        });
    }

    /** Changes the type of the item and creates apropriate fields */
    typeChange(ev: TypeSelectEvent) {
        if (this.typeSub) {
            this.typeSub.unsubscribe();
        }
        this.typeSub = this.typeService.getType(ev.typeId).subscribe((type: Type) => {
            this.form.typeId = type.id;
            this.createFormControls(ev.typeId, type.fields);
        });
    }

    get controlKeys() {
        return Object.keys(this.form.controls);
    }

    get globalControlKeys() {
        return Object.keys(this.globalForm.controls);
    }

    private createFormControls(typeId: number, fields: TypeField[]) {
        const controls = {};
        fields.forEach(field => {
            controls[field.name] = ItemFormControl.fromField(field);
        });
        this.form = new ItemFormGroup(typeId, -1, controls);
    }

    private createGlobalFormControls(fields: TypeField[]) {
        this.globalControls = {};
        fields.forEach(field => {
            this.globalControls[field.name] = ItemFormControl.fromField(field, true);
        });
        this.globalForm = new FormGroup(this.globalControls);
    }
}
