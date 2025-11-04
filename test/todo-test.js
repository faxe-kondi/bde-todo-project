import { Selector } from 'testcafe';


const TODO_APP_URL = process.env.TODO_APP_URL;

if (!TODO_APP_URL) {
    throw new Error('TODO_APP_URL environment variable is not set');
}

fixture('Todo App E2E')
    .page(TODO_APP_URL);

    // Test 1: Add a new todo
test('Add a new todo', async t => {
    const todoInput = Selector('#todo-input');
    const submitButton = Selector('.todo-form button[type="submit"]');
    const todoList = Selector('#todo-list');

    await t
        .typeText(todoInput, 'Test Todo')
        .click(submitButton)
        .expect(todoList.child('li').innerText).contains('Test Todo');
});

// Test 2: Mark a todo as completed
test('Mark a todo as completed', async t => {
    const todoItem = Selector('#todo-list li').withText('Test Todo');

    await t
        .click(todoItem)
        .expect(todoItem.hasClass('completed')).ok();
});

// Test 3: Delete a todo
test('Delete a todo', async t => {
    const todoItem = Selector('#todo-list li').withText('Test Todo');
    const deleteButton = todoItem.find('button.delete');

    await t
        .click(deleteButton)
        .expect(todoItem.exists).notOk();
});