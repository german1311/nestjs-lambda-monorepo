import {
    ArgumentMetadata,
    Injectable,
    Type,
    ValidationPipe,
    ValidationPipeOptions,
} from "@nestjs/common";

@Injectable()
export class AbstractValidationPipe extends ValidationPipe {
    constructor(
        options: ValidationPipeOptions,
        private readonly targetTypes: {
            body?: Type;
            query?: Type;
            param?: Type;
        },
    ) {
        super(options);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
        const targetType = this.targetTypes[metadata.type];
        if (!targetType) {
            return super.transform(value, metadata);
        }

        return super.transform(value, { ...metadata, metatype: targetType });
    }
}
