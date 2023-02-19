import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import {
  CreateUserDto,
  UpdateUserDto,
  FindOneUserParamsDto,
  DeleteUserParamsDto,
} from './dto';
import { ApiExceptionResponse } from 'src/common/dto/api-exception-response.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiResponse({
    status: 400,
    description: 'Bad request.',
    type: ApiExceptionResponse,
  })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiResponse({
    status: 400,
    description: 'Bad request.',
    type: ApiExceptionResponse,
  })
  @Get(':id')
  findOne(@Param('id') findOneUserDto: FindOneUserParamsDto) {
    return this.usersService.findOne(findOneUserDto.id);
  }

  @ApiResponse({
    status: 400,
    description: 'Bad request.',
    type: ApiExceptionResponse,
  })
  @Patch(':id')
  update(
    @Param('id') id: FindOneUserParamsDto,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(+id, updateUserDto);
  }

  @ApiResponse({
    status: 400,
    description: 'Bad request.',
    type: ApiExceptionResponse,
  })
  @Delete(':id')
  remove(@Param() params: DeleteUserParamsDto) {
    return this.usersService.remove(params.id);
  }
}
