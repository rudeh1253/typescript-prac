export interface TodoListProps {
    items: { id: string; text: string }[];
}

function TodoList({ items }: TodoListProps): JSX.Element {
    const todos = items;
    return (
        <ul>
            {todos.map((todo: any) => (
                <li key={todo.id}>{todo.text}</li>
            ))}
        </ul>
    );
}

export default TodoList;
