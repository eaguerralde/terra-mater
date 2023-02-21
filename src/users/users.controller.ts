import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import {
  CreateUserDto,
  UpdateUserDto,
  FindOneUserParamsDto,
  DeleteUserParamsDto,
} from './dto';
import { ApiExceptionResponse } from '../common/dto/api-exception-response.dto';
import { JwtAuthGuard } from '../../src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
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
  findOne(@Param() findOneUserDto: FindOneUserParamsDto) {
    return this.usersService.findOne(findOneUserDto.id);
  }

  @ApiResponse({
    status: 400,
    description: 'Bad request.',
    type: ApiExceptionResponse,
  })
  @Patch(':id')
  update(
    @Param() params: FindOneUserParamsDto,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(params.id, updateUserDto);
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
