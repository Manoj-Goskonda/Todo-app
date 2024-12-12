import React, { useState, useEffect } from "react";

export default function Todo(props) {
  const { todo, setTodos } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(todo.todo);

  const updateTodo = async (todoId, updatedFields) => {
    const res = await fetch(`/api/todos/${todoId}`, {
      method: "PUT",
      body: JSON.stringify(updatedFields),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await res.json();
    if (json.acknowledged) {
      setTodos((currentTodos) => {
        return currentTodos.map((currentTodo) => {
          if (currentTodo._id === todoId) {
            return { ...currentTodo, ...updatedFields };
          }
          return currentTodo;
        });
      });
    }
  };

  const handleEdit = () => {
    if (isEditing && editedText !== todo.todo) {
      updateTodo(todo._id, { todo: editedText });
    }
    setIsEditing(!isEditing);
  };

  const deleteTodo = async (todoId) => {
    const res = await fetch(`/api/todos/${todoId}`, {
      method: "DELETE",
    });
    const json = await res.json();
    if (json.acknowledged) {
      setTodos((currentTodos) => {
        return currentTodos.filter((currentTodo) => currentTodo._id !== todoId);
      });
    }
  };

  return (
    <div className="todo">
      {isEditing ? (
        <input
          type="text"
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
        />
      ) : (
        <p>{todo.todo}</p>
      )}
      <div className="mutations">
        <button
          className="todo__status"
          onClick={() => updateTodo(todo._id, { status: !todo.status })}
        >
          {todo.status ? "☑" : "☐"}
        </button>
        <button className="todo__edit" onClick={handleEdit}>
          {isEditing ? "Save" : "Edit"}
        </button>
        <button className="todo__delete" onClick={() => deleteTodo(todo._id)}>
          ❌
        </button>
      </div>
    </div>
  );
}
