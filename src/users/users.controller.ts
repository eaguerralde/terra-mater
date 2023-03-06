import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  ForbiddenException,
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
import { PublicRoute } from '../common/decorators/public-route.decorator';
import { Ability } from '@casl/ability';
import { CaslAbilityFactory } from '../casl/casl-ability.factory/casl-ability.factory';
import { Actions } from '../casl/enums/actions.enum';
import { User } from './entities/user.entity';
import { AuthRequest } from 'src/auth/types/auth-request.type';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  @PublicRoute()
  @ApiResponse({
    status: 400,
    description: 'Bad request.',
    type: ApiExceptionResponse,
  })
  @Post()
  create(
    @Body() createUserDto: CreateUserDto,
    @Request() req: AuthRequest,
  ) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Request() req: AuthRequest) {
    const ability: Ability = this.caslAbilityFactory.createForUser(req.user);
    if (ability.cannot(Actions.Read, 'all')) throw new ForbiddenException();
    return this.usersService.findAll();
  }

  @ApiResponse({
    status: 400,
    description: 'Bad request.',
    type: ApiExceptionResponse,
  })
  @Get(':id')
  async findOne(
    @Param() findOneUserDto: FindOneUserParamsDto,
    @Request() req: AuthRequest,
  ) {
    const foundUser: User = await this.usersService.findOne(findOneUserDto.id);
    const ability: Ability = this.caslAbilityFactory.createForUser(req.user);
    if (ability.cannot(Actions.Read, foundUser)) throw new ForbiddenException();
    return foundUser;
  }

  @ApiResponse({
    status: 400,
    description: 'Bad request.',
    type: ApiExceptionResponse,
  })
  @Patch(':id')
  async update(
    @Param() params: FindOneUserParamsDto,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: AuthRequest,
  ) {
    const userToUpdate = await this.usersService.findOne(params.id);
    const ability: Ability = this.caslAbilityFactory.createForUser(req.user);
    if (ability.cannot(Actions.Update, userToUpdate))
      throw new ForbiddenException();
    return this.usersService.update(params.id, updateUserDto);
  }

  @ApiResponse({
    status: 400,
    description: 'Bad request.',
    type: ApiExceptionResponse,
  })
  @Delete(':id')
  async remove(
    @Param() params: DeleteUserParamsDto,
    @Request() req: AuthRequest,
  ) {
    const userToDelete = await this.usersService.findOne(params.id);
    const ability: Ability = this.caslAbilityFactory.createForUser(req.user);
    if (ability.cannot(Actions.Delete, userToDelete))
      throw new ForbiddenException();
    return this.usersService.remove(params.id);
  }
}
