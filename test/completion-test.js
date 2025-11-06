import { Selector } from 'testcafe';

// for local testing
// fixture`Todo test`
//   .page('http://localhost:5173');

// for pipeline test
fixture`Todo test`
  .page(process.env.testPage);

// 🧩 Test 4: Toggle completion status
test('Toggle completion status', async t => {
    const todoInput = Selector('#todo-input');
    const submitButton = Selector('.todo-form button[type="submit"]');
    const todoList = Selector('#todo-list');

    // Add a new todo
    await t
        .typeText(todoInput, 'Toggle Me')
        .click(submitButton)
        .expect(todoList.child('li').withText('Toggle Me').exists)
        .ok('New todo should appear');

    // Select the newly added todo and its toggle checkbox/button
    const todoItem = todoList.child('li').withText('Toggle Me');
    const toggleButton = todoItem.find('#toggleBtn'); // or replace with checkbox selector if you changed the markup

    // Click to mark as completed
    await t
        .click(toggleButton);

    // Expect the todo text to now have the "completed" class (or green checkbox, depending on your UI)
    const todoText = todoItem.find('span').nth(0);
    await t.expect(todoText.hasClass('completed')).ok('Todo should be marked as completed');

    // Click again to undo
    await t
        .click(toggleButton);

    // Expect the "completed" class to be removed
    await t.expect(todoText.hasClass('completed')).notOk('Todo should be unmarked as completed');
});