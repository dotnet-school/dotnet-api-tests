import React from 'react';
import './todo-app.css';

const fetchItems = (baseUrl) => fetch(`${baseUrl}/todos`);

const createTodoItem = (baseUrl, todo) => fetch(`${baseUrl}/todos`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(todo)
})

const updateTodoItem = (baseUrl, todo) => fetch(`${baseUrl}/todos/${todo.id}`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(todo)
});

const deleteTodoItem = (baseUrl, id) => fetch(`${baseUrl}/todos/${id}`, {
    method: "DELETE"
})

const TodoApp = ({baseUrl}) => {
    const [list, setList] = React.useState([]); 
    const [isLoading, setLoading] = React.useState(true);
    const inputRef = React.useRef(null);
    
    const setupData = async () => {
        const response = await fetchItems(baseUrl);
        const data = await response.json();
        setList(data);
        setLoading(false);
    };

    React.useEffect(() => {
        setupData()
        return () => {}
    }, [isLoading]); 
    
    const onCreateItem = async () => {
        const description = inputRef.current.value;
        setLoading(true);
        const result = await createTodoItem(baseUrl, {description});
        setLoading(false);
        inputRef.current.value = '';
    };
    
    const setTaskStatus = async (item, isCompleted) => {
        setLoading(true);
        await updateTodoItem(baseUrl, {...item, isCompleted});
        setLoading(false);
    };
    
    const onRemoveItem = async (e, item) => {
        e.preventDefault();
        setLoading(true);
        await deleteTodoItem(baseUrl, item.id);
        setLoading(false);
    }
    
    const content = <div className='todo-app-container'>
        <form>
            <input disabled={isLoading} placeholder="Enter a task name" ref={inputRef}/>
            <button disabled={isLoading} onClick={onCreateItem}>Add Task</button>
        </form>
        <ul className='todo-list'>
            {list.map(item => (<li className="todo-list-item" key={item.id}>
                <input
                    type='checkbox' 
                    checked={item.isCompleted} 
                    onChange={(e) => setTaskStatus(item, e.target.checked)}/>
                    <label>{item.description}</label>
                    <a href="#" onClick={(e) => onRemoveItem(e, item)}>remove</a>
            </li>))}
            
        </ul>
    </div>;
    
    return (
        <>
            <h3>Todo App</h3>
            {content}
        </>
    );
};

export default TodoApp;