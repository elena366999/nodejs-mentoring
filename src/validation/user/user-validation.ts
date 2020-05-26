import Joi from '@hapi/joi';
import passwordComplexity from 'joi-password-complexity';
import users from '../../data/users';

export class UserValidation {
    complexityOptions: Record<string, unknown> = {
        min: 6,
        max: 26,
        lowerCase: 0,
        upperCase: 0,
        numeric: 1,
        symbol: 0,
        requirementCount: 2
    };
    schema: Joi.ObjectSchema;
    filterParamsSchema: Joi.ObjectSchema;

    constructor() {
        this.schema = this.createUserSchema();
        this.filterParamsSchema = this.createFilterParamsSchema();
    }

    private createUserSchema() {
        return Joi.object().keys({
            id: Joi.string().optional(),
            login: Joi.string().trim().custom((login: string, helpers: Joi.CustomHelpers) => {
                if (users.filter(u => u.login === login && u.id !== helpers.state.ancestors[0].id).length > 0) {
                    return helpers.error('string.invalid');
                }
                return login;
            }).message('Login already in use').required(),
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            password: passwordComplexity(this.complexityOptions),
            age: Joi.number().integer().min(4).max(130).required(),
            isDeleted: Joi.boolean().required()
        });
    }

    private createFilterParamsSchema() {
        return Joi.object({
            loginSubstring: Joi.string().required(),
            limit: Joi.number().integer().positive().optional()
        });
    }
}
