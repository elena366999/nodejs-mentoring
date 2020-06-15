import Joi from '@hapi/joi';

export class GroupValidation {
    schema: Joi.ObjectSchema;
    idParamSchema: Joi.ObjectSchema;
    userIdsParamSchema: Joi.ObjectSchema;

    constructor() {
        this.schema = this.createSchema();
        this.idParamSchema = this.createIdParamSchema();
        this.userIdsParamSchema = this.createUserIdsParamSchema();
    }

    private createSchema() {
        return Joi.object().keys({
            id: Joi.string().uuid({ version: 'uuidv1' }).optional(),
            name: Joi.string().trim().required(),
            permissions: Joi.array().items(Joi.string()
                .valid('READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES')).unique().optional()
        });
    }

    private createIdParamSchema(): Joi.ObjectSchema {
        return Joi.object({
            id: Joi.string().uuid({ version: 'uuidv1' }).required()
        });
    }

    private createUserIdsParamSchema(): Joi.ObjectSchema {
        return Joi.object({
            userIds: Joi.array().items(Joi.string().uuid({ version: 'uuidv1' })).unique().required()
        });
    }
}
