import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { getUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTaskFilterDTO } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    constructor(private tasksService: TasksService){}

    @Get()
    getTasks (
        @Query(ValidationPipe) filterDTO: GetTaskFilterDTO,
        @getUser() user: User
    ): Promise<Task[]> {
        return this.tasksService.getTasks(filterDTO, user);
    }

    @Get(':id')
    getTaskById (
        @Param('id', ParseIntPipe) taskId: number,
        @getUser() user: User
    ) : Promise<Task> {
        return this.tasksService.getTaskById(taskId, user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask (
        @Body() createTaskDTO: CreateTaskDTO,
        @getUser() user: User
    ):Promise<Task> {
        return this.tasksService.createTask(createTaskDTO, user);
    }

    @Delete(':id')
    deleteTask(
        @Param('id') taskId: number,
        @getUser() user: User
    ):Promise<void> {
        return this.tasksService.deleteTask(taskId, user);
    }

    @Patch('/:id/status')
    updateTaskStatus(
        @Param('id') taskId: number,
        @Body('status', TaskStatusValidationPipe) status: TaskStatus,
        @getUser() user: User
    ):Promise<Task> {
        return this.tasksService.updateTaskStatus(taskId, status, user);
    }
}
