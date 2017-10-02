import {Injectable} from '@angular/core';
import {ITodo} from './Todo';
import {findIndex, clone} from 'lodash';

@Injectable()
export class TodoService {
    public todos: ITodo[] =
    [
        {id: 1, name: 'Walk in the park', isDone: false, sortOrder: 1},
        {id: 2, name: 'Read Book', isDone: false, sortOrder: 2},
        {id: 3, name: 'Run an errand', isDone: false, sortOrder: 3},
        {id: 4, name: 'Have dinner', isDone: false, sortOrder: 4}
    ];

    public sortedTodos: ITodo[];

    public isMarkedUnDoneOnly: boolean;

     getTodos(): ITodo[] {
        return this.todos;
    }

    getSortedTodos(isMarkedUnDoneOnly: boolean): ITodo[] {
        this.isMarkedUnDoneOnly = isMarkedUnDoneOnly;
        this.generateSortedTodos();
        if (! isMarkedUnDoneOnly) {
            this.filterUnDoneTodosOnly();
        }
        return this.sortedTodos;
    }

    saveNewTodo(todo: ITodo, isMarkedUnDoneOnly) {
        todo.id = this.getNextId();
        todo.sortOrder = this.getNextSortOrder();
        this.todos.push(todo);
        this.getSortedTodos(isMarkedUnDoneOnly);
    }

    updateTodo(todo: ITodo, isMarkedUnDoneOnly) {
        const index = findIndex(this.todos, (t: ITodo) => {
            return t.id === todo.id;
        });
        this.todos[index] = todo;
        this.getSortedTodos(isMarkedUnDoneOnly);

    }

    deleteTodo(todo: ITodo, isMarkedUnDoneOnly: boolean) {
        const index = findIndex(this.todos, (t: ITodo) => {
            return t.id === todo.id;
        });

        const sortedIndex = findIndex(this.sortedTodos, (t: ITodo) => {
            return t.id === todo.id;
        });

        this.todos.splice(index, 1);
        const arrSortOrder = this.todos.map( function(elem) {return elem.sortOrder; }).sort();
        this.getSortedTodos(isMarkedUnDoneOnly);
    }

    updateTodoDone(todo: ITodo, isDone: boolean) {
        todo.isDone = isDone;

        const currentIndex = findIndex(this.todos, (t: ITodo) => {
            return t.id === todo.id ;
        });

        const sortedTodosIndex = findIndex(this.todos, (t: ITodo) => {
            return t.id === todo.id ;
        });

        this.todos[currentIndex] = todo;
        this.sortedTodos[sortedTodosIndex] = todo;
    }

    moveTodoDown(todo: ITodo) {
        const currentIndex = findIndex(this.todos, (t: ITodo) => {
            return t.id === todo.id ;
        });

        const maxSortOrder = this.todos.map( function (elem) {
            return (elem.sortOrder);
            }).reduce( function (prevVal, elemVal) {
                return Math.max(prevVal, elemVal);
        });

        if (todo.sortOrder !== maxSortOrder) {
             // Get the previous sortOrder
             const arrSortOrder = this.todos.map( function(elem) {return elem.sortOrder; }).sort();
             const tempIndex: any = arrSortOrder.filter( function (elem) { return (elem === maxSortOrder); } );

             const nextSortOrder: number = todo.sortOrder + 1;

            //  for ( let i = nextSortOrder  ; i === 0  ; i-- ) {
            //     if (! (nextSortOrder === arrSortOrder[i] ) ) {
            //         nextSortOrder++;
            //      } else {
            //          break;
            //      }
            //  }

            // Get index of prevSortOrder
            const nextSortOrderIndex = findIndex(this.todos, (t: ITodo) => {
                return t.sortOrder === nextSortOrder;
            });

            // swap the sort orders of the current element and the next element
            const tempSortOrder = this.todos[nextSortOrderIndex].sortOrder;
            this.todos[nextSortOrderIndex].sortOrder = this.todos[currentIndex].sortOrder;

            this.todos[currentIndex].sortOrder = tempSortOrder;

            this.sortedTodos = this.getSortedTodos(this.isMarkedUnDoneOnly);

        }

    }

    moveTodoUp(todo: ITodo) {
        const currentIndex = findIndex(this.todos, (t: ITodo) => {
            return t.id === todo.id ;
        });

        const minSortOrder = this.todos.map( function (elem) {
            return (elem.sortOrder);
            }).reduce( function (prevVal, elemVal) {
                return Math.min(prevVal, elemVal);
        });

        if (todo.sortOrder !== minSortOrder) {
             // Get the previous sortOrder
             const arrSortOrder = this.todos.map( function(elem) {return elem.sortOrder; }).sort();
             const tempIndex: any = arrSortOrder.filter( function (elem) { return (elem === minSortOrder); } );

             const nextSortOrder: number = todo.sortOrder - 1;

             let nextSortOrderIndex = findIndex(this.todos, (t: ITodo) => {
                return t.sortOrder === nextSortOrder;
            });

            //  for ( let i = 0  ; i < arrSortOrder.length  ; i++ ) {
            //      if (nextSortOrder === arrSortOrder[i] )  {
            //          break;
            //      } else {
            //         nextSortOrder--;
            //      }
            //  }

            nextSortOrderIndex = findIndex(this.todos, (t: ITodo) => {
                return t.sortOrder === nextSortOrder;
            });

            // swap the sort orders of the current element and the next element
            const tempSortOrder = this.todos[nextSortOrderIndex].sortOrder;
            this.todos[nextSortOrderIndex].sortOrder = this.todos[currentIndex].sortOrder;

            this.todos[currentIndex].sortOrder = tempSortOrder;

            this.generateSortedTodos();

            this.sortedTodos = this.getSortedTodos(this.isMarkedUnDoneOnly);
        }

    }

    generateSortedTodos() {
        // initialize the array that contains the sorted todos
        this.sortedTodos = [];
        const arrSortOrder = this.todos.map( function(elem) {return elem.sortOrder; }).sort();

        for (let i = 0; i < arrSortOrder.length ; i++) {
            const tempIndex = findIndex(this.todos, (t: ITodo) => {
                return t.sortOrder ===  arrSortOrder[i] ;
            });
            this.sortedTodos.push(this.todos[tempIndex]);
        }
        // this.sortedTodos = clone(tempTodos);
    }

    filterUnDoneTodosOnly() {
        this.sortedTodos = this.sortedTodos.filter( function(elem) {return elem.isDone === false; } );
    }



    getNextId(): number {
        if (this.todos.length === 0) {
            return 1;
        }
        return  Math.max(... this.todos.map(function(elem) { return elem.id; } )) + 1;
    }

    getNextSortOrder(): number {
        if (this.todos.length === 0) {
            return 1;
        }
        return  Math.max(... this.todos.map(function(elem) { return elem.sortOrder; } )) + 1;
    }



}

