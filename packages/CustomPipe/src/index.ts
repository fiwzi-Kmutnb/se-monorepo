    import { BadRequestException, HttpStatus, Injectable, Optional } from '@nestjs/common';
    import { PipeTransform, ArgumentMetadata } from '@nestjs/common/interfaces';
    import { ZodSchema } from 'zod';
    import { HTTPException } from '@se/customfilter';

    interface TypeWithZodSchema {
        zodSchema?: ZodSchema<any>;
    }

    @Injectable()
    export class ZodValidationPipe implements PipeTransform<any> {
        private readonly errorHttpStatusCode: number;
        //@ts-ignore
        constructor(@Optional() options?: { errorHttpStatusCode?: number }) {
            this.errorHttpStatusCode = (options?.errorHttpStatusCode) || HttpStatus.BAD_REQUEST;
        }

        transform(value: any, metadata: ArgumentMetadata): any {
            const zodSchema = (metadata?.metatype as TypeWithZodSchema)?.zodSchema;
            if (zodSchema) {
                const parseResult = zodSchema.safeParse(value);
                if (!parseResult.success) {
                    const { error } = parseResult;
                    const message = error.errors.map((error) => `${error.message}`);
                    throw new HTTPException({
                        message: message[0],
                    });
                }
                return parseResult.data;
            }
            return value;
        }
    }