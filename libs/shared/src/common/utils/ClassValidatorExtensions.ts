import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
    ValidateBy,
    isNumber,
    isString,
    isNumberString,
    isInt,
    isArray,
    isBoolean,
    validateSync,
} from "class-validator";
import { plainToInstance } from "class-transformer";
import { Types } from "mongoose";

const InnerTypesValidator = {
    number: isNumber,
    string: isString,
    numberString: isNumberString,
    int: isInt,
    array: isArray,
    boolean: isBoolean,
};

export const IsGenericType = (
    validators: (
        | keyof typeof InnerTypesValidator
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        | ((value: any) => boolean)
    )[],
    validationOptions?: ValidationOptions,
): PropertyDecorator =>
    ValidateBy(
        {
            name: "IS_GENERIC_TYPE",
            validator: {
                validate: (value: unknown) => {
                    return validators.some((item) =>
                        typeof item === "function"
                            ? item(value)
                            : InnerTypesValidator[item]?.(value),
                    );
                },
                defaultMessage: (validationArguments?: ValidationArguments) => {
                    return `${validationArguments?.property}: Data type mismatch`;
                },
            },
        },
        validationOptions,
    );

@ValidatorConstraint({ async: false })
class IsObjectIdConstraint implements ValidatorConstraintInterface {
    validate(id: string): boolean {
        return Types.ObjectId.isValid(id);
    }

    defaultMessage(): string {
        return "Text ($value) is not a valid ObjectId";
    }
}

export function IsObjectId(validationOptions?: ValidationOptions) {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function (object: Object, propertyName: string): void {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsObjectIdConstraint,
        });
    };
}

export const validateClass = <T>(
    schema: new () => T,
    data: NonNullable<unknown>,
    /**
     * @beta
     * If true, extraneous properties are allowed.
     * This is useful when you want to allow extra properties in the body of a request.
     */
    excludeExtraneousValues = false,
): T => {
    const instance = plainToInstance(schema, data, {
        excludeExtraneousValues,
    });
    // @ts-expect-error the object is valid
    const errors = validateSync(instance);

    if (errors.length > 0) {
        throw new Error(`Validation failed: ${JSON.stringify(errors)}`);
    }

    return instance;
};

export class ObjectIdClassParam {
    @IsObjectId()
    id: string;
}
