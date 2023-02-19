export class ApiExceptionResponse {
  /**
   * Response status code
   * @example 400
   */
  statusCode: number;

  /**
   * Response ISO timestamp
   * @example '2023-02-17 10:20:01'
   */
  timestamp: string;

  /**
   * Request path
   * @example '/users'
   */
  path: string;

  /**
   * Exception type
   * @example 'BadRequestException'
   */
  type: string;

  /**
   * Exception message
   * @example ["password should not be empty"]
   */
  message: string;
}
