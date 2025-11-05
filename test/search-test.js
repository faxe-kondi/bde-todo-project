import { Selector } from 'testcafe';

// for local testing
// fixture`Todo search feature test`
//   .page('http://localhost:5173');

// for pipeline test
fixture`Todo search feature test`
  .page(process.env.testPage);

// 🧩 Test 1: Search filters todos by text
test('Filter todos by search input', async t => {
    const todoInput = Selector('#todo-input');
    const categoryInput = Selector('#category-input');
    const submitButton = Selector('.todo-form button[type="submit"]');
    const searchInput = Selector('#search-input');
    const todoList = Selector('#todo-list');

    // Add multiple todos
    await t
        .typeText(todoInput, 'Buy groceries')
        .typeText(categoryInput, 'Home')
        .click(submitButton)
        .typeText(todoInput, 'Finish project report')
        .typeText(categoryInput, 'Work')
        .click(submitButton)
        .typeText(todoInput, 'Call mom')
        .typeText(categoryInput, 'Personal')
        .click(submitButton);

    // Wait for re-render
    await t.wait(300);

    // Type partial text in search input
    await t
        .typeText(searchInput, 'project')
        .expect(todoList.child('li').count)
        .eql(1)
        .expect(todoList.innerText)
        .contains('Finish project report')
        .expect(todoList.innerText)
        .notContains('Buy groceries')
        .expect(todoList.innerText)
        .notContains('Call mom');

    // Clear search to show all todos again
    await t
        .selectText(searchInput)
        .pressKey('delete')
        .expect(todoList.child('li').count)
        .gte(3);
});

// 🧩 Test 2: Search works together with category filter
test('Search filters within selected category', async t => {
    const todoInput = Selector('#todo-input');
    const categoryInput = Selector('#category-input');
    const submitButton = Selector('.todo-form button[type="submit"]');
    const categoryFilter = Selector('#category-filter');
    const searchInput = Selector('#search-input');
    const todoList = Selector('#todo-list');

    // Add todos in the same category
    await t
        .typeText(todoInput, 'Work meeting')
        .typeText(categoryInput, 'Work')
        .click(submitButton)
        .typeText(todoInput, 'Work presentation')
        .typeText(categoryInput, 'Work')
        .click(submitButton)
        .typeText(todoInput, 'Home cleaning')
        .typeText(categoryInput, 'Home')
        .click(submitButton);

    await t.wait(500);

    // Filter by "Work" category
    await t
        .click(categoryFilter)
        .click(categoryFilter.find('option').withText('Work'))
        .expect(todoList.child('li').count)
        .eql(2);

    // Search for "presentation" within Work category
    await t
        .typeText(searchInput, 'presentation')
        .expect(todoList.child('li').count)
        .eql(1)
        .expect(todoList.innerText)
        .contains('Work presentation')
        .expect(todoList.innerText)
        .notContains('Work meeting')
        .expect(todoList.innerText)
        .notContains('Home cleaning');

    // Clear search and reset filters
    await t
        .selectText(searchInput)
        .pressKey('delete')
        .click(categoryFilter)
        .click(categoryFilter.find('option').withText('All'))
        .expect(todoList.child('li').count)
        .gte(3);
});