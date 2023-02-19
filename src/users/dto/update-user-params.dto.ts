import { PartialType } from '@nestjs/mapped-types';
import { FindOneUserParamsDto } from './find-one-user-params.dto';

export class UpdateUserParamsDto extends PartialType(FindOneUserParamsDto) {}
