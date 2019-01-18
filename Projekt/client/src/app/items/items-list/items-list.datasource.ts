import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ItemService } from '../../stores/item-store/item.service';

/**
 * Data source for the ItemList view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class ItemListDataSource extends DataSource<any> {
    private typeId: any;

    constructor(
        private paginator: MatPaginator,
        private sort: MatSort,
        private itemService: ItemService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        super();
    }

    /**
     * Connect this data source to the table. The table will only update when
     * the returned stream emits new items.
     * @returns A stream of the items to be rendered.
     */
    connect(): Observable<any[]> {
        // Combine everything that affects the rendered data into one update
        // stream for the data-table to consume.
        const dataMutations = [this.paginator.page, this.sort.sortChange];
        this.route.params.subscribe(params => {
            this.typeId = params.itemTypeId;
        });

        merge(...dataMutations).subscribe((ev: any) => {
            this.router.navigate([
                '/items',
                'view',
                {
                    outlets: {
                        content: this.typeId
                            ? [
                                  this.paginator.pageIndex,
                                  this.paginator.pageSize,
                                  this.typeId
                              ]
                            : [
                                  this.paginator.pageIndex,
                                  this.paginator.pageSize
                              ]
                    }
                }
            ]);
        });
        return this.itemService.items.pipe(
            map(items => {
                this.paginator.pageIndex = this.itemService.page;
                this.paginator.pageSize = this.itemService.perPage;
                this.paginator.length = this.itemService.total;
                return items;
            })
        );
    }

    /**
     *  Called when the table is being destroyed. Use this function, to clean up
     * any open connections or free any held resources that were set up during connect.
     */
    disconnect() {}
}
