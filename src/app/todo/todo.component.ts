import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { TaskInterface } from '../models/task.interface';
import { Status } from '../models/status.enum';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
})
export class TodoComponent implements OnInit {
  form!: FormGroup;

  toDo: TaskInterface[] = [];
  inProgress: TaskInterface[] = [];
  done: TaskInterface[] = [];

  updateIndex!: number | null;
  isUpdateMode!: boolean;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.form = this.fb.group({
      descreption: ['', Validators.required],
    });
  }

  onSubmit(): void {
    console.log(this.form.value);
  }
  addTask(): void {
    const { descreption: task } = this.form.value;
    this.toDo.push({
      descreption: task,
      status: Status.toDo,
    });
    this.form.reset();
  }
  onEdit(index: number, task: TaskInterface): void {
    console.log(task);
    this.form.controls['descreption'].setValue(task.descreption);
    this.updateIndex = index;
    this.isUpdateMode = true;
  }

  updateTask(): void {
    if (typeof this.updateIndex === 'number') {
      this.toDo[this.updateIndex].descreption = this.form.value.descreption;
      this.toDo[this.updateIndex].status = Status.toDo;
      this.isUpdateMode = false;
      this.updateIndex = null;
      this.form.reset();
    }
  }

  deleteTask(index: number): void {
    this.toDo.splice(index, 1);
  }

  deleteInProgressTask(index: number): void {
    this.inProgress.splice(index, 1);
  }
  deleteDoneTask(index: number): void {
    this.done.splice(index, 1);
  }

  drop(event: CdkDragDrop<TaskInterface[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
