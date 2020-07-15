import Joi from '@hapi/joi';

export class LoginValidation {
    schema: Joi.ObjectSchema;

    constructor() {
        this.schema = this.createSchema();
    }

    private createSchema() {
        return Joi.object({
            login: Joi.string().required(),
            password: Joi.string().required()
        });
    }
}
