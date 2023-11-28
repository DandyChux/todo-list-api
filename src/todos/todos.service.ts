import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Todo, TodoDocument } from './todo.schema';
import { Model } from 'mongoose';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodosService {
  constructor(@InjectModel(Todo.name) private todoModel: Model<TodoDocument>) {}

  async create(user_id: string, createTodoDto: CreateTodoDto): Promise<Todo> {
    // const newTodo = await new this.todoModel(createTodoDto);
    // newTodo.user_id = userId;
    return await new this.todoModel({
      ...createTodoDto,
      user_id,
    }).save();
  }

  async findAll(): Promise<Todo[]> {
    return this.todoModel.find().exec();
  }

  async update(id: string, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    return await this.todoModel.findByIdAndUpdate(id, updateTodoDto).exec();
  }

  async delete(id: string): Promise<Todo> {
    return await this.todoModel.findByIdAndDelete(id).exec();
  }

  // TODO: add additional methods for updating and deleting todos here

  async findUserTodos(user_id: string): Promise<Todo[]> {
    return this.todoModel.find({ user_id }).exec();
  }

  async findUserTodoById(user_id: string, id: string): Promise<Todo> {
    return this.todoModel.findOne({ user_id, _id: id }).exec();
  }
}
