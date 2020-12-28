import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTaskFilterDTO } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository
    ) {}

    async getTasks(
        filterDTO: GetTaskFilterDTO,
        user: User
    ): Promise<Task[]>{
        return this.taskRepository.getTasks(filterDTO, user);
    }

    async getTaskById(
        taskId: number,
        user: User
    ): Promise<Task> {
        const found = await this.taskRepository.findOne({where: {id: taskId, userId: user.id}});

        if(!found){
            throw new NotFoundException(`Task with ${taskId} not found`);
        }

        return found;
    }

    async createTask(
        createTaskDTO: CreateTaskDTO,
        user: User
    ): Promise<Task> {
        return this.taskRepository.createTask(createTaskDTO, user);
    }

    async deleteTask(
        taskId: number,
        user: User
    ): Promise<void> {
        const result = await this.taskRepository.delete({id: taskId, userId: user.id});

        if(result.affected === 0) {
            throw new NotFoundException(`Task with ${taskId} not found`);
        }
    }

    async updateTaskStatus(
        taskId: number, 
        status: TaskStatus,
        user: User
        ): Promise<Task>{
        const task = await this.getTaskById(taskId, user);
        task.status = status;
        await task.save();
        return task;
    }
}
