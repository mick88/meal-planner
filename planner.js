
const generateBtn = document.getElementById('generateBtn');
const addBtn = document.getElementById('addBtn');
const ingredientListDiv = document.getElementById('ingredient-list');

let allIngredients = [];
let selectedIngredients = []; // Now stores objects like {name, groups, pinned, isNew}

// Fetch ingredient data once when the script loads
fetch('ingredients.json')
    .then(response => response.json())
    .then(data => {
        allIngredients = data;
    });

// Re-renders the entire ingredient list based on the current state
const renderIngredients = () => {
    if (selectedIngredients.length === 0) {
        ingredientListDiv.innerHTML = '<p>Click the button to get a meal idea!</p>';
        addBtn.style.display = 'none';
        return;
    }

    // Create a list to hold the ingredient elements
    const listHtml = selectedIngredients.map(ing => {
        const pinnedClass = ing.pinned ? 'pinned' : '';
        const newClass = ing.isNew ? 'new-ingredient' : '';
        // Clear the isNew flag after rendering
        ing.isNew = false;
        return `
            <li class="${newClass}">
                <div class="ingredient-info">
                    <strong>${ing.name}</strong>
                    <small>${ing.groups.join(', ')}</small>
                </div>
                <button class="pin-btn ${pinnedClass}" data-name="${ing.name}">📌</button>
            </li>
        `;
    }).join('');

    ingredientListDiv.innerHTML = `<h3>Selected Ingredients:</h3><ul>${listHtml}</ul>`;
    addBtn.innerHTML = 'Add another ➕';
    addBtn.style.display = 'inline-block';
};

// Adds a specified number of unique random ingredients
const addRandomIngredients = (count) => {
    if (count <= 0) return [];

    const selectedNames = new Set(selectedIngredients.map(ing => ing.name));
    const availableIngredients = allIngredients.filter(ing => !selectedNames.has(ing.name));

    for (let i = availableIngredients.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [availableIngredients[i], availableIngredients[j]] = [availableIngredients[j], availableIngredients[i]];
    }

    const newIngredients = availableIngredients.slice(0, count).map(ing => ({
        ...ing,
        pinned: false,
        isNew: true // Flag for animation
    }));
    
    selectedIngredients.push(...newIngredients);
    return newIngredients;
};

// Event listener for the main generate button
generateBtn.addEventListener('click', () => {
    // Keep pinned ingredients, remove others
    selectedIngredients = selectedIngredients.filter(ing => ing.pinned);
    // Mark all remaining (pinned) ingredients as not new
    selectedIngredients.forEach(ing => ing.isNew = false);

    const numToGenerate = 3 - selectedIngredients.length;
    addRandomIngredients(numToGenerate);
    renderIngredients();
});

// Event listener for the add button
addBtn.addEventListener('click', () => {
    addRandomIngredients(1);
    renderIngredients();
});

// Event listener for pin clicks (using event delegation)
ingredientListDiv.addEventListener('click', (e) => {
    if (e.target.classList.contains('pin-btn')) {
        const ingredientName = e.target.dataset.name;
        const ingredient = selectedIngredients.find(ing => ing.name === ingredientName);
        if (ingredient) {
            ingredient.pinned = !ingredient.pinned; // Toggle pinned state
            renderIngredients(); // Re-render to update the button's class
        }
    }
});
