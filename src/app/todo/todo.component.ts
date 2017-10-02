import { ITodo } from './Todo';
import { Component, OnInit } from '@angular/core';
import {TodoService} from './todo.service';
import {clone} from 'lodash';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {

  todos: ITodo[];
  sortedTodos: ITodo[];
  newTodo: ITodo;
  editedTodo: ITodo;

  isNewTodoForm: boolean;

  isEditTodoForm: boolean;

  isMarkedUnDoneOnly: boolean;

  _statusMessage= 'Loading data. Please wait ...';

  constructor(private _todoService: TodoService) {}

  ngOnInit() {
    this.getTodos();
    this.getSortedTodos();
  }

  getTodos() {
    this.todos = this._todoService.getTodos();
  }

  getSortedTodos() {
    this.sortedTodos = this._todoService.getSortedTodos(this.isMarkedUnDoneOnly);
  }


  showEditTodoForm(todo: ITodo) {
     this.isEditTodoForm = true;
     this.isNewTodoForm = false;
     this.editedTodo = clone(todo);
   }

  showAddTodoForm() {

    this.isNewTodoForm = true;
    this.isEditTodoForm = false;
    this.newTodo = {id: 0, name: '', isDone: false, sortOrder: 0};

   }

   updateTodo(isMarkedUnDoneOnly: boolean) {
     this._todoService.updateTodo(this.editedTodo, isMarkedUnDoneOnly);
     this.isEditTodoForm = false;
     this.editedTodo = {id: 0, name: '', isDone: false, sortOrder: 0};
     this.ngOnInit();
   }

  saveNewTodo(newTodo, isMarkedUnDoneOnly: boolean) {
     this.isMarkedUnDoneOnly = isMarkedUnDoneOnly;
     this._todoService.saveNewTodo(newTodo, isMarkedUnDoneOnly);
     this.isNewTodoForm = false;
     this.newTodo = {id: 0, name: '', isDone: false, sortOrder: 0};
     this.ngOnInit();
   }

  deleteTodo(todo: ITodo, isMarkedUnDoneOnly: boolean) {
     this._todoService.deleteTodo(todo, isMarkedUnDoneOnly);
     this.ngOnInit();
   }


  updateTodoDone(todo: ITodo, isDone: boolean) {
    this._todoService.updateTodoDone(todo, isDone);
  }

  displayTodos(isMarkedUnDoneOnly: boolean) {
    this.isMarkedUnDoneOnly = isMarkedUnDoneOnly;
    // this._todoService.getSortedTodos(isMarkedUnDoneOnly);
    this.ngOnInit();
  }

  moveTodoUp(todo) {
    this._todoService.moveTodoUp(todo);
    this.ngOnInit();
  }

  moveTodoDown(todo) {
    this._todoService.moveTodoDown(todo);
    this.ngOnInit();
  }


}
