import {
  Body,
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  UseGuards,
  Request,
  Render,
} from '@nestjs/common';
import { Todo } from './todo.schema';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { JwtAuthGuard } from '~/auth/jwt-auth.guard';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  @Render('todos')
  async todosPage() {
    const todos = await this.todosService.findAll();
    return { todos };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/create')
  @Render('new-todo')
  async newTodoPage() {
    return { message: '' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  async create(
    @Request() req,
    @Body() createTodoDto: CreateTodoDto,
  ): Promise<Todo> {
    return this.todosService.create(req.user.userId, createTodoDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return await this.todosService.update(id, updateTodoDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.todosService.delete(id);
  }

  // TODO: Add routes for updating and deleting todos here
}
