import { PartialType } from '@nestjs/mapped-types';
import { FindOneUserParamsDto } from './find-one-user-params.dto';

export class DeleteUserParamsDto extends PartialType(FindOneUserParamsDto) {}
