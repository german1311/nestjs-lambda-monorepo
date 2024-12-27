import {
    ArgumentMetadata,
    BadRequestException,
    Injectable,
    PipeTransform,
} from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { throwError } from "../utils/throw-error.utils";

@Injectable()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class ValidationPipe implements PipeTransform<any> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async transform(value, metadata: ArgumentMetadata): Promise<any> {
        /* istanbul ignore else */
        if (!value) {
            throw new BadRequestException("No data submitted");
        }

        const { metatype } = metadata;

        /* istanbul ignore else */
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }

        const object = plainToClass(metatype, value);
        const errors = await validate(object, {
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
        });

        /* istanbul ignore else */
        if (errors.length > 0) {
            throwError(this.buildError(errors), "Input data validation failed");
        }

        return value;
    }

    private buildError(errors): Record<string, string> {
        const result = {};
        errors.forEach((el) => {
            let prop = el.property;
            let constraints = el;
            // if object to validate has nested objects
            while (constraints.constraints === undefined) {
                prop += constraints.property;
                constraints = constraints.children[0];
            }
            Object.entries(constraints.constraints).forEach((constraint) => {
                result[prop + constraint[0]] = `${constraint[1]}`;
            });
        });

        return result;
    }

    private toValidate(metatype): boolean {
        const types = [String, Boolean, Number, Array, Object];
        return !types.find((type) => metatype === type);
    }
}
