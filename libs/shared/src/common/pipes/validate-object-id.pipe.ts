import { Injectable, PipeTransform } from "@nestjs/common";
import { Types } from "mongoose";
import { throwError } from "../utils/throw-error.utils";

@Injectable()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class ValidateObjectIdPipe implements PipeTransform<any> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(private readonly entity: any) {}

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async transform(params: any): Promise<any> {
        /* istanbul ignore else */
        if (!params?.id)
            throwError(
                { [this.entity ? this.entity : `${"Entity"}`]: "Not found" },
                "No ID provided",
            );

        /* istanbul ignore else */
        if (!Types.ObjectId.isValid(params.id))
            throwError(
                { [this.entity ? this.entity : `${"Entity"}`]: "Not found" },
                "Check passed ID",
            );
        return params;
    }
}
