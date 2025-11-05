import { Selector } from 'testcafe';

fixture`Todo test`
  .page(process.env.testPage);

    // Test 0: Check if page loads
test('Verify page loads', async t => {
  await t.expect(Selector('body').exists).ok();
});

// 🧩 Test 1: Add a new todo
test('Add a new todo', async t => {
    const todoInput = Selector('#todo-input');
    const submitButton = Selector('.todo-form button[type="submit"]');
    const todoList = Selector('#todo-list');

    await t
        .typeText(todoInput, 'Test Todo')
        .click(submitButton)
        .expect(todoList.child('li').innerText)
        .contains('Test Todo');
});

// 🧩 Test 2: Mark a todo as completed
test('Mark a todo as completed', async t => {
    const todoInput = Selector('#todo-input');
    const submitButton = Selector('.todo-form button[type="submit"]');
    const todoList = Selector('#todo-list');

    // Add a new todo first
    await t
        .typeText(todoInput, 'Complete Todo')
        .click(submitButton);

    const todoItem = todoList.child('li').withText('Complete Todo');

    await t
        .click(todoItem.find('span')) // assuming clicking the text toggles completion
        .expect(todoItem.hasClass('completed')).ok();
});

// 🧩 Test 3: Edit a todo
test('Edit a todo', async t => {
    const todoInput = Selector('#todo-input');
    const submitButton = Selector('.todo-form button[type="submit"]');
    const todoList = Selector('#todo-list');

    // Add a new todo
    await t
        .typeText(todoInput, 'Old Todo')
        .click(submitButton);

    const todoItem = todoList.child('li').withText('Old Todo');
    const editButton = todoItem.find('#editBtn');
    const todoText = todoItem.find('span');

    // Click edit button
    await t.click(editButton);

    // Assuming clicking "Edit" replaces the text with an input field
    const editInput = Selector('input[type="text"]'); // adjust if different
    await t
        .selectText(editInput)
        .pressKey('delete')
        .typeText(editInput, 'Updated Todo')
        .pressKey('enter')
        .expect(todoText.innerText).eql('Updated Todo');
});

// 🧩 Test 4: Delete a todo
test('Delete a todo', async t => {
    const todoInput = Selector('#todo-input');
    const submitButton = Selector('.todo-form button[type="submit"]');
    const todoList = Selector('#todo-list');

    // Add a new todo first
    await t
        .typeText(todoInput, 'Test Todo')
        .click(submitButton)
        .expect(todoList.child('li').innerText)
        .contains('Test Todo');

    const todoItem = todoList.child('li').withText('Test Todo');
    const deleteButton = todoItem.find('#removeBtn');

    await t
        .click(deleteButton)
        .expect(todoItem.exists).notOk();
});