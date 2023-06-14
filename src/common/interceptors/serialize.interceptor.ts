import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from "@nestjs/common";
import { ClassConstructor, plainToInstance } from "class-transformer";
import { map, Observable } from "rxjs";

export function Serialize(dto: ClassConstructor<{}>) {
    return UseInterceptors(new SerializeInterceptor(dto))
}

export class SerializeInterceptor implements NestInterceptor {
    constructor(private dto: ClassConstructor<{}>) {}

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        return next.handle().pipe(
            map((data: any) => {
                return plainToInstance(this.dto, data, {
                    excludeExtraneousValues: true
                })
            })
        )
    }
}