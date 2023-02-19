import { PartialType } from '@nestjs/swagger';
import { FindOneUserParamsDto } from './find-one-user-params.dto';

export class DeleteUserParamsDto extends PartialType(FindOneUserParamsDto) {}
