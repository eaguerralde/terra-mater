import { IsNumberString } from 'class-validator';

export class FindOneUserParamsDto {
  /**
   * User's ID
   * @example 123
   */
  @IsNumberString()
  id: number;
}
