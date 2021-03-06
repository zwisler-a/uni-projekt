import { ObjectValidator } from '../../util/object-validator';

/**
 * Represents a global field
 * @author Maurice
 */
export interface GlobalField {
    /** The field's unique id */
    id?: number;
    /** The id of the company this field belongs to */
    companyId?: number;
    /** The field's specifiy unique name */
    name: string;
    /** The field's {@link TypeFieldType} */
    type: string;
    /** True if the field shouldn't be nullable */
    required: boolean;
    /** True if the field's value should be unique among one type */
    unique: boolean;
}

/** Object validator for {@link GlobalField} */
export const GLOBAL = new ObjectValidator<GlobalField>({
    type: Object,
    required: true,
    properties: {
        id: {
            type: Number
        },
        name: {
            type: String,
            required: true,
            range: {
                min: 1,
                max: 64
            }
        },
        type: {
            type: String,
            required: true,
            enum: ['string', 'number', 'boolean', 'file', 'color', 'date']
        },
        required: {
            type: Boolean,
            required: true
        },
        unique: {
            type: Boolean,
            required: true
        }
    }
});