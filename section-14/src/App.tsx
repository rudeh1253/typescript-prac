import { useState } from "react";
import NewTodo from "./components/NewTodo";
import TodoList from "./components/TodoList";
import { Todo } from "./todo.model";

export type NewTodoProps = {
    onAddTodo: (text: string) => void;
};

function App(): JSX.Element {
    const [todos, setTodos] = useState<Todo[]>([]);

    const todoAddHandler = (text: string) => {
        setTodos([{ id: Math.random().toString(), text: text }, ...todos]);
    };

    return (
        <div>
            <NewTodo onAddTodo={todoAddHandler} />
            <TodoList items={todos} />
        </div>
    );
}

export default App;
