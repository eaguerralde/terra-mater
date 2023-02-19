import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  /**
   * User Name
   * @example 'Edu'
   */
  @IsNotEmpty()
  name: string;

  /**
   * User account\'s password
   * @example 'Password1234'
   */
  @IsNotEmpty()
  password: string;
}
