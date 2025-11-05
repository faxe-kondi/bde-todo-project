import { Selector } from 'testcafe';

// for local testing
// fixture`Todo category test`
//   .page('http://localhost:5173');

// for pipeline test
fixture`Todo category test`
  .page(process.env.testPage);

// 🧩 Test 1: Add a todo with a category
test('Add a todo with a category', async t => {
    const todoInput = Selector('#todo-input');
    const categoryInput = Selector('#category-input');
    const submitButton = Selector('.todo-form button[type="submit"]');
    const todoList = Selector('#todo-list');

    await t
        .typeText(todoInput, 'Category Todo')
        .typeText(categoryInput, 'Work')
        .click(submitButton)
        .expect(todoList.child('li').innerText)
        .contains('Category Todo')
        .expect(todoList.child('li').innerText)
        .contains('Work');
});

// 🧩 Test 2: Filter todos by category
test('Filter todos by category', async t => {
    const todoInput = Selector('#todo-input');
    const categoryInput = Selector('#category-input');
    const submitButton = Selector('.todo-form button[type="submit"]');
    const categoryFilter = Selector('#category-filter');
    const todoList = Selector('#todo-list');

    // Add multiple todos in different categories
    await t
        .typeText(todoInput, 'Work Todo')
        .typeText(categoryInput, 'Work')
        .click(submitButton)
        .typeText(todoInput, 'Home Todo')
        .typeText(categoryInput, 'Home')
        .click(submitButton)
        .typeText(todoInput, 'Other Todo')
        .typeText(categoryInput, 'Other')
        .click(submitButton);

    // Wait for dropdown to update (categories are dynamically populated)
    await t.wait(500);

    // Filter by 'Home' category
    await t
        .click(categoryFilter)
        .click(categoryFilter.find('option').withText('Home'))
        .expect(todoList.child('li').count)
        .eql(1)
        .expect(todoList.innerText)
        .contains('Home Todo')
        .expect(todoList.innerText)
        .notContains('Work Todo')
        .expect(todoList.innerText)
        .notContains('Other Todo');

    // Filter by 'Work' category
    await t
        .click(categoryFilter)
        .click(categoryFilter.find('option').withText('Work'))
        .expect(todoList.child('li').count)
        .eql(1)
        .expect(todoList.innerText)
        .contains('Work Todo');

    // Filter by 'All'
    await t
        .click(categoryFilter)
        .click(categoryFilter.find('option').withText('All'))
        .expect(todoList.child('li').count)
        .gte(3);
});

// 🧩 Test 3: Edit a todo’s category
test('Edit a todo’s category and verify updates', async t => {
    const todoInput = Selector('#todo-input');
    const categoryInput = Selector('#category-input');
    const submitButton = Selector('.todo-form button[type="submit"]');
    const todoList = Selector('#todo-list');
    const categoryFilter = Selector('#category-filter');

    // Add a todo with an initial category
    await t
        .typeText(todoInput, 'Edit Category Todo')
        .typeText(categoryInput, 'Work')
        .click(submitButton)
        .expect(todoList.innerText)
        .contains('Work');

    // Edit the todo
    const todoItem = todoList.child('li').withText('Edit Category Todo');
    const editButton = todoItem.find('#editBtn');

    // Mock both prompts: first for text, then for category
    await t.setNativeDialogHandler((type, message) => {
        if (message.includes('Edit todo')) return 'Edit Category Todo';
        if (message.includes('Edit category')) return 'Personal';
        return null;
    });

    await t.click(editButton);

    // 🕒 Wait for re-render
    await t.wait(300);

    // Verify category text updated in the list
    const updatedTodo = todoList.child('li').withText('Edit Category Todo');
    const categorySpan = updatedTodo.find('#todo-category');
    await t.expect(categorySpan.innerText).eql('Personal');

    // Verify that the category filter now includes "Personal"
    await t
        .click(categoryFilter)
        .expect(categoryFilter.find('option').withText('Personal').exists)
        .ok();
});