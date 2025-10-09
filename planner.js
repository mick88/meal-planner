const generateBtn = document.getElementById('generateBtn');
const addBtn = document.getElementById('addBtn');
const resultDiv = document.getElementById('result');

let allIngredients = [];
let selectedIngredients = [];

// Fetch ingredient data once when the script loads
fetch('ingredients.json')
    .then(response => response.json())
    .then(data => {
        allIngredients = data;
        // Initially hide the add button
        addBtn.style.display = 'none';
    });

// Function to render the list of selected ingredients
const renderIngredients = () => {
    if (selectedIngredients.length === 0) {
        resultDiv.innerHTML = '<p>Click the button to get a meal idea!</p>';
        addBtn.style.display = 'none';
        return;
    }

    resultDiv.innerHTML = `
        <h3>Selected Ingredients:</h3>
        <ul>
            ${selectedIngredients.map(ing => `<li><strong>${ing.name}</strong> (${ing.groups.join(', ')})</li>`).join('')}
        </ul>
    `;
    addBtn.style.display = 'inline-block'; // Show the add button
};

// Function to add a specified number of unique random ingredients
const addRandomIngredients = (count) => {
    // Find ingredients that are not already selected
    const availableIngredients = allIngredients.filter(ing => 
        !selectedIngredients.some(selected => selected.name === ing.name)
    );

    // Shuffle the available ingredients
    for (let i = availableIngredients.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [availableIngredients[i], availableIngredients[j]] = [availableIngredients[j], availableIngredients[i]];
    }

    // Add the new ingredients to the selection
    const newIngredients = availableIngredients.slice(0, count);
    selectedIngredients.push(...newIngredients);
};

// Event listener for the main generate button
generateBtn.addEventListener('click', () => {
    selectedIngredients = []; // Clear the list
    addRandomIngredients(3);
    renderIngredients();
});

// Event listener for the add button
addBtn.addEventListener('click', () => {
    addRandomIngredients(1);
    renderIngredients();
});