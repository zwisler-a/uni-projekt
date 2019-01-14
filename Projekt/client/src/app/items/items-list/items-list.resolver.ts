import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import {
    ActivatedRouteSnapshot,
    Resolve,
    Router,
    RouterStateSnapshot
} from '@angular/router';

import { ItemTransformationService } from '../item-transformation.service';
import { ItemService } from '../item.service';
import { TypesService } from '../types.service';
import { Item } from '../types/item.interface';

@Injectable({ providedIn: 'root' })
export class ItemsListResolver implements Resolve<Item> {
    constructor(
        private itemService: ItemService,
        private router: Router,
        private snackbar: MatSnackBar,
        private types: TypesService,
        private transform: ItemTransformationService
    ) {}

    async resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Promise<any> {
        const types = await this.types.getTypes();
        // if no types are available redirect to add a type
        if (types.length === 0) {
            this.router.navigate(['/types']);
            this.snackbar.open('No types to display', '', {
                duration: 2000,
                horizontalPosition: 'end'
            });
            return Promise.resolve();
        }
        const { page, perPage, itemTypeId } = route.params;
        // check if route has all important info
        if (
            page === undefined ||
            perPage === undefined ||
            itemTypeId === undefined
        ) {
            const defaultRoute = [
                '/items',
                'view',
                { outlets: { content: [0, 50, types[0].id] } }
            ];
            this.router.navigate(defaultRoute);
        }

        const res: any = await this.itemService
            .getItems(page, perPage, itemTypeId)
            .toPromise();

        const body = res.body;
        return {
            page,
            perPage,
            list: await this.transform.transformItems(body.items),
            types: body.types,
            length: Number.parseInt(res.headers.get('X-Total'), 10) || 0
        };
    }
}
