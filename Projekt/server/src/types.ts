export interface DatabaseConfig {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
    prefix: string;
}

export interface SslConfig {
    enabled: boolean;
    cert: string;
    key: string;
}

export interface Config {
    host?: string;
    port?: number;
    socket?: string;
    ssl: SslConfig;
    database: DatabaseConfig;
    mailer: MailerConfig;
}

export interface MailerConfig {
    service: string;
    secure: boolean;
    port: number;
    user: string;
    pass: string;
    tlsRejectUnauthorized: boolean;
}

export enum ErrorNumber {
    REQUEST_URL_UNDEFINED,
    REQUEST_URL_NUMBER_FORMAT,
    REQUEST_URL_ENUM,

    REQUEST_FIELD_MISSING,
    REQUEST_FIELD_NULL,
    REQUEST_FIELD_TYPE,
    REQUEST_FIELD_ENUM,
    REQUEST_FIELD_LENGTH,
    REQUEST_FIELD_MIN,
    REQUEST_FIELD_MAX,
    REQUEST_FIELD_STRING_FORMAT,
    REQUEST_FIELD_NUMBER_FORMAT,
    REQUEST_FIELD_DATE_FORMAT,

    PAGINATION_OUT_OF_BOUNDS,

    AUTHENTICATION_INVALID_CREDENTIALS,
    AUTHENTICATION_MISSING_JSONWEBTOKEN,
    AUTHENTICATION_INVALID_JSONWEBTOKEN,

    AUTHENTICATION_INSUFFICIENT_PERMISSION,
    AUTHENTICATION_INVALID_COMPANY,

    COMPANY_NOT_FOUND,

    USER_NOT_FOUND,

    TYPE_NOT_FOUND,
    TYPE_REFERENCE_NOT_FOUND,
    TYPE_REFERENCE_NOT_NULL,
    TYPE_REFERENCE_MULTIPLE,
    TYPE_REFERENCE_SELF,

    TYPE_FIELD_NOT_FOUND,

    GLOBAL_FIELD_NOT_FOUND,

    ITEM_NOT_FOUND,

    FILE_NOT_FOUND,
    FILE_FIELD_WRONG_TYPE,

    ROLE_NOT_FOUND,
}

export class ApiError extends Error {
    status: number;
    errorNumber: ErrorNumber;
    errorName: string;
    cause: any;

    static BAD_REQUEST(errorNumber: ErrorNumber, cause?: any) {
        return new ApiError('Bad Request', 'The server cannot or will not process the request due to a client error', 400, errorNumber, cause);
    }

    static UNAUTHORIZED(errorNumber: ErrorNumber, cause?: any) {
        return new ApiError('Unauthorized', 'The request has not been applied because it lacks valid authentication credentials for the target resource.', 401, errorNumber, cause);
    }

    static FORBIDDEN(errorNumber: ErrorNumber, cause?: any) {
        return new ApiError('Forbidden', 'The request was valid, but the server is refusing action. The user need the necessary permissions for this resource.', 403, errorNumber, cause);
    }

    static NOT_FOUND(errorNumber: ErrorNumber, cause?: any) {
        return new ApiError('Not found', 'The requested resource could not be found but may be available in the future', 404, errorNumber, cause);
    }

    constructor(name: string, message: string, status: number, errorNumber: ErrorNumber, cause?: any) {
        super();

        this.name = name;
        this.message = message;
        this.status = status;
        this.errorNumber = errorNumber;
        this.errorName = ErrorNumber[errorNumber];

        if (cause instanceof Error) {
            this.cause = {
                name: cause.name,
                message: cause.message
            };
        } else {
            this.cause = cause;
        }
    }
}
