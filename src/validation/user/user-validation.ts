import Joi from '@hapi/joi';
import passwordComplexity from 'joi-password-complexity';
import { UserService } from '../../services/user-service';

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
    idParamSchema: Joi.ObjectSchema;
    filterParamsSchema: Joi.ObjectSchema;

    userService: UserService = new UserService();

    constructor() {
        this.schema = this.createUserSchema();
        this.filterParamsSchema = this.createFilterParamsSchema();
        this.idParamSchema = this.createIdParamSchema();
    }

    private createUserSchema() {
        return Joi.object().keys({
            id: Joi.string().uuid({ version: 'uuidv1' }).optional(),
            // eslint-disable-next-line no-unused-vars
            login: Joi.string().trim().required(),
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            password: passwordComplexity(this.complexityOptions),
            age: Joi.number().integer().min(4).max(130).required(),
            isDeleted: Joi.boolean().required()
        });
    }

    private createFilterParamsSchema(): Joi.ObjectSchema {
        return Joi.object({
            loginSubstring: Joi.string().required(),
            limit: Joi.number().integer().positive()
        });
    }

    private createIdParamSchema(): Joi.ObjectSchema {
        return Joi.object({
            id: Joi.string().uuid({ version: 'uuidv1' }).required()
        });
    }
}
