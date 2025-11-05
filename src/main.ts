/**
 * NOTE to self
 * Make a module and import the functions from the module
 * Seperate the functions into different files
 * Logical grouping of functions - for example, all functions related to adding a todo item can be in one file
 * 
 */


/**
 * REDO it. More streqamlined and better structure - 
 */


// 1 Import the CSS file: This ensures that the styles are applied to the HTML elements.
import './style.css';

// Step 2: Define the Todo interface
// Define the Todo interface: This interface defines the structure of a todo item.
export interface Todo {
  id: number;
  text: string;
  completed: boolean;

  // 9️⃣ NEW: Add category field to each todo
  category?: string;
}

// Step 3: Initialize an empty array to store todos
// Initialize an empty array: This array will store the list of todos.
export let todos: Todo[] = [];

// 9️⃣ NEW: Variable to store currently selected filter
let currentFilter: string = 'all';

// Step 4: Get references to the HTML elements
// Get references to the HTML elements: These references will be used to interact with the DOM
const todoInput = document.getElementById('todo-input') as HTMLInputElement; // exist in HTML file
const todoForm = document.querySelector('.todo-form') as HTMLFormElement;    // exist in HTML file
const todoList = document.getElementById('todo-list') as HTMLUListElement;   // exist in HTML file

// 9️⃣ NEW: Get reference to category input field
const categoryInput = document.getElementById('category-input') as HTMLInputElement | null;

// 9️⃣ NEW: Get reference to category filter dropdown (add this element to your HTML)
const categoryFilter = document.getElementById('category-filter') as HTMLSelectElement | null;




// Step 5: Function to add a new todo
// Function to add a new todo: This function creates a new todo object and adds it to the array.
export const addTodo = (text: string, category?: string): void => { // 9️⃣ UPDATED: add category param
  const newTodo: Todo = {
    id: Date.now(), // Generate a unique ID based on the current timestamp
    text: text,
    completed: false,
    category: category || 'Uncategorized', // 9️⃣ NEW: default category if none entered
  };
  todos.push(newTodo);
  console.log("Todo added: ", todos); // Log the updated list of todos to the console
  renderTodos(); // Render the updated list of todos => create the function next
};

// Step 6: Function to render the list of todos
// Function to render the list of todos: This function updates the DOM to display the current list of todos.
const renderTodos = (): void => { // void because no return - what we are doing is updating the DOM
  // Clear the current list
  todoList.innerHTML = '';

  // 9️⃣ NEW: Filter todos based on current category filter
  const filteredTodos = todos.filter(todo =>
    currentFilter === 'all' || todo.category === currentFilter
  );

  // Iterate over the filtered todos array and create list items for each todo
  filteredTodos.forEach(todo => { 
    const li = document.createElement('li');
    li.className = 'todo-item'; // Add a class to the list item
    // Use template literals to create the HTML content for each list item
    li.innerHTML = `
        <span>${todo.text}</span>
        <span id="todo-category">${todo.category}</span> <!-- 9️⃣ NEW: show category -->
      <div id="buttonBox">
        <button id="editBtn">Edit</button>
        <button id="removeBtn">Remove</button>
      </div>
    `;
    addRemoveButtonListener(li, todo.id); 
    addEditButtonListener(li, todo.id); 
    todoList.appendChild(li);
  });

  // 9️⃣ NEW: Update dropdown options every time list is rendered
  updateCategoryFilterOptions();
};

// 9️⃣ NEW: Function to update category filter dropdown dynamically
const updateCategoryFilterOptions = (): void => {
  if (!categoryFilter) return;

  // Get unique categories
  const uniqueCategories = Array.from(new Set(todos.map(todo => todo.category)));

  // Clear existing options
  categoryFilter.innerHTML = '<option value="all">All</option>';

  // Add each unique category as an option
  uniqueCategories.forEach(category => {
    if (category) {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    }
  });

  // Keep selected value persistent
  categoryFilter.value = currentFilter;
};

// 9️⃣ NEW: Listen for filter changes
categoryFilter?.addEventListener('change', (event: Event) => {
  const target = event.target as HTMLSelectElement;
  currentFilter = target.value;
  renderTodos();
});

// Step 6.1: Function to render the list of todos
// Initial render
renderTodos();


// Step 7: Event listener for the form submission
// Event listener for the form submission: This listener handles the form submission, adds the new todo, and clears the input field.
todoForm.addEventListener('submit', (event: Event) => {
  event.preventDefault(); 
  const text = todoInput.value.trim(); 
  
  // 9️⃣ NEW: Get category input value
  const category = categoryInput ? categoryInput.value.trim() : '';

  if (text !== '') { 
    addTodo(text, category); // 9️⃣ UPDATED: pass category
    todoInput.value = ''; 
    if (categoryInput) categoryInput.value = ''; // 9️⃣ NEW: Clear category input
  }
});

//Improved code for step 7 - user input validation
const errorMessage = document.getElementById('error-message') as HTMLParagraphElement;

todoForm.addEventListener('submit', (event: Event) => {
  event.preventDefault(); 
  const text = todoInput.value.trim(); 
  const category = categoryInput ? categoryInput.value.trim() : ''; // 9️⃣ NEW: include category input

  if (text !== '') { 
    todoInput.classList.remove('input-error'); 
    errorMessage.style.display = 'none'; 
    addTodo(text, category); // 9️⃣ UPDATED: pass category
    todoInput.value = ''; 
    if (categoryInput) categoryInput.value = ''; // 9️⃣ NEW: clear category input
  } else {
    console.log("Please enter a todo item"); 
    todoInput.classList.add('input-error'); 
    errorMessage.style.display = 'block'; 
  }
});


// Step 8: Function to removes all a todo by ID
const addRemoveButtonListener = (li: HTMLLIElement, id: number): void => {
  const removeButton = li.querySelector('#removeBtn');
  removeButton?.addEventListener('click', () => removeTodo(id)); 
};

// Step 8: Function to remove a todo by ID
export const removeTodo = (id: number): void => {
  todos = todos.filter(todo => todo.id !== id);
  renderTodos(); 
}; 

// Edit event listener - make button and add button to each todo
const addEditButtonListener = (li: HTMLLIElement, id:number) => {
  const editButton = li.querySelector('#editBtn')
  editButton?.addEventListener('click', () => editTodo(id)) 
}

// Edit function - prompt user to edit the todo : editTodo
const editTodo = (id:number) => {
  const todo = todos.find(todo => todo.id === id)
  if (todo) {
    const text = prompt('Edit todo', todo.text)
    // 9️⃣ NEW: allow editing of category
    const category = prompt('Edit category', todo.category || '')
    if (text) {
      todo.text = text
      todo.category = category || 'Uncategorized' // 9️⃣ NEW: update category
      renderTodos()
    }
  }
}

/** 
 * Kristian: 6th of September 2024, BDE
 * 
 * This is the list of optional features that can be added to the todo list application:
 * You must make at least one of these features to complete the project. The more the merrier.
 * In your submission video, please mention which feature you have implemented and demonstrate how it works. Go through the code and explain how you implemented the feature and how it works.
 * IF, you want to implement something not on list, you can do that as well.
*/


//Optional features list: 

// Option 1: Add a button to toggle the completed status of a todo item
// Function to toggle the completed status of a todo + 
// Add a button to toggle the completed status of a todo item

// Option 2: Add a button to clear all completed todos
// Add a button to clear all completed todos
// Function to clear all completed todos
// Add a button to toggle all todos

// Option 3: Add a button to toggle all todos
// Edit a todo item and update it
// Add an input field to edit a todo item
// Save the updated todo item
// Cancel the editing of a todo item
// Add a button to cancel the editing of a todo item

// Option 4: Add a button to filter todos by status
// Add a button to filter todos by status
// Function to filter todos by status

// Option 5: Add a button to sort todos by status
// Add a button to sort todos by status
// Function to sort todos by status

// Option 6: Due Date for Todos:
// Add a date input field to set a due date for each todo item.
// Display the due date next to each todo item.
// Highlight overdue todos.
// Priority Levels:

// Option 7: Add a dropdown to set the priority level (e.g., Low, Medium, High) for each todo item.
// Display the priority level next to each todo item.
// Sort todos by priority.
// Search Functionality:

// Option 8: Add a search input field to filter todos based on the search query.
// Display only the todos that match the search query.
// Category Tags:

// Option 9: Add a text input field to assign category tags to each todo item.
// Display the tags next to each todo item.
// Filter todos by category tags.
// Progress Indicator:

// Option 10: Add a progress bar to show the percentage of completed todos.
// Update the progress bar as todos are marked as completed or incomplete.
// Dark Mode Toggle:

// Option 11: Add a button to toggle between light and dark modes.
// Change the app's theme based on the selected mode.
// Export/Import Todos:

// Option 12: Add buttons to export the list of todos to a JSON file.
// Add functionality to import todos from a JSON file.
// Notifications:

// Option 13: Add notifications to remind users of due todos.
// Use the Notification API to show browser notifications.

// Option 14: Local Storage:
// Save the list of todos to local storage.
// Retrieve the todos from local storage on page load.
// Add a button to clear all todos from local storage.

// Option 15: JSDOC Comments:
// Add JSDoc comments to document the functions and interfaces in the code.
// Link : https://jsdoc.app/

// Optional 16: Handle Errors:
// Add error handling for user input validation. Show red text or border for invalid input.
// Display error messages for invalid input.

