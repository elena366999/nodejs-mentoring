import { Schema, ValidationErrorItem } from '@hapi/joi';
import { NextFunction, Request, RequestHandler, Response } from 'express';

export class SchemaValidation {
    public static validateSchema(schema: Schema): RequestHandler {
        return (req: Request, res: Response, next: NextFunction) :void => {
            req.body.id = req.params.id;
            const { error } = schema.validate(req.body, {
                abortEarly: false,
                allowUnknown: false
            });
            if (error !== undefined && error.isJoi) {
                res.status(400).json(this.errorResponse(error.details));
            } else {
                // eslint-disable-next-line callback-return
                next();
            }
        };
    }

    private static errorResponse(schemaErrors: ValidationErrorItem[]): unknown {
        const errors = schemaErrors.map((error: ValidationErrorItem) => {
            const { path, message } = error;
            return { path, message };
        });
        return {
            status: 'failed',
            errors
        };
    }
}
