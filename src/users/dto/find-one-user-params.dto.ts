import { IsNumberString } from 'class-validator';

export class FindOneUserParamsDto {
    @IsNumberString()
    id: number;
}
