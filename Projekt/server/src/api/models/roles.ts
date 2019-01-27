import { ObjectValidator } from './object-validator';

export interface Role {
    id: number;
    companyId: number;
    name: string;
    permission: Buffer;
    permissions: RolePermission[];
}

export interface RolePermission {
    roleId: number;
    typeId: number;
    permission: Buffer;
}

export enum PermissionType {
    ITEM_READ,
    ITEM_WRITE,
    TYPE_EDIT
}

export const ROLE = new ObjectValidator<Role>({
    companyId: {
        type: Number,
    },
    name: {
        type: String,
        required: true
    },
    permission: {
        type: Array,
        required: true,
        elements: {
            typeId: {
                type: Number,
                required: true
            },
            permission: {
                type: Array,
                required: true,
                elements: {

                }
            }
        }
    },
});