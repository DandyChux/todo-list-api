export class UpdateTodoDto {
  title: string;
  description: string;
  completed: boolean;
  due_date?: Date;
}
