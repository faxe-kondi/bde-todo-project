import { Selector } from 'testcafe';


    // for local testing
fixture`Todo test`
  .page('http://localhost:5173');

  // for pipeline test
// fixture`Todo test`
//   .page(process.env.testPage);

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


// 🧩 Test 2: Edit a todo
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

    // Handle the prompt
    await t.setNativeDialogHandler(() => 'Updated Todo');

    // Click edit (triggers prompt + DOM update)
    await t.click(editButton);

    // 🕒 Wait for the DOM to update
    const updatedTodoItem = todoList.child('li').withText('Updated Todo');
    const updatedTodoText = updatedTodoItem.find('span');

    await t.expect(updatedTodoText.innerText).eql('Updated Todo');
});

// 🧩 Test 3: Delete a todo
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