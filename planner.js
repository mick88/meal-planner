document.addEventListener('DOMContentLoaded', () => {
    // Element references
    const generateBtn = document.getElementById('generateBtn');
    const addBtn = document.getElementById('addBtn');
    const saveMealBtn = document.getElementById('saveMealBtn');
    const ingredientListDiv = document.getElementById('ingredient-list');
    const savedMealsList = document.getElementById('saved-meals-list');
    const modal = document.getElementById('ingredientsModal');
    const viewAllBtn = document.getElementById('viewAllBtn');
    const modalListDiv = document.getElementById('modal-ingredient-list');
    const resetIngredientsBtn = document.getElementById('resetIngredientsBtn');
    const addIngredientForm = document.getElementById('add-ingredient-form');
    const newIngredientNameInput = document.getElementById('new-ingredient-name');
    const newIngredientGroupsDiv = document.getElementById('new-ingredient-groups');
    const savedMealsModal = document.getElementById('savedMealsModal');
    const viewSavedBtn = document.getElementById('viewSavedBtn');
    const searchRecipesBtn = document.getElementById('searchRecipesBtn');

    // State variables
    let allIngredients = [];
    let selectedIngredients = [];
    let allAvailableGroups = new Set();
    let savedMeals = [];

    // --- Data Management ---

    const saveIngredients = () => localStorage.setItem('userIngredients', JSON.stringify(allIngredients));
    const saveMeals = () => localStorage.setItem('savedMeals', JSON.stringify(savedMeals));

    const initializeApp = (data) => {
        allIngredients = data;
        allAvailableGroups.clear();
        allIngredients.forEach(ing => ing.groups.forEach(group => allAvailableGroups.add(group)));
        if (modal.style.display === 'block') populateModal();
    };

    const loadIngredients = () => {
        const userIngredients = localStorage.getItem('userIngredients');
        if (userIngredients) {
            initializeApp(JSON.parse(userIngredients));
        } else {
            fetch('ingredients.json').then(response => response.json()).then(data => initializeApp(data));
        }
    };

    const loadSavedMeals = () => {
        const storedMeals = localStorage.getItem('savedMeals');
        if (storedMeals) {
            savedMeals = JSON.parse(storedMeals);
            renderSavedMeals();
        }
    };

    // --- Rendering ---

    const renderIngredients = () => {
        const hasIngredients = selectedIngredients.length > 0;
        saveMealBtn.style.display = hasIngredients ? 'block' : 'none';
        addBtn.style.display = hasIngredients ? 'inline-block' : 'none';
        searchRecipesBtn.style.display = hasIngredients ? 'block' : 'none';

        if (!hasIngredients) {
            ingredientListDiv.innerHTML = '<p>Click the button to get a meal idea!</p>';
            return;
        }

        const listHtml = selectedIngredients.map(ing => {
            const pinnedClass = ing.pinned ? 'pinned' : '';
            const newClass = ing.isNew ? 'new-ingredient' : '';
            ing.isNew = false;

            // Find suggestions for the tooltip
            const suggestions = allIngredients
                .filter(suggestion => 
                    ing.name !== suggestion.name && 
                    suggestion.groups.some(group => ing.groups.includes(group))
                )
                .map(suggestion => suggestion.name.replace(/\p{Emoji}/gu, '').trim());
            
            let tooltipText = '';
            if (suggestions.length > 0) {
                // Shuffle and take top 5
                for (let i = suggestions.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [suggestions[i], suggestions[j]] = [suggestions[j], suggestions[i]];
                }
                tooltipText = `Similar: ${suggestions.slice(0, 5).join(', ')}`;
            }

            return `<li class="${newClass}" title="${tooltipText}">
                <div class="ingredient-info"><strong>${ing.name}</strong><small>${ing.groups.join(', ')}</small></div>
                <div class="button-container">
                    <button class="pin-btn ${pinnedClass}" data-name="${ing.name}">📌</button>
                    <button class="remove-btn" data-name="${ing.name}">🗑️</button>
                </div>
            </li>`;
        }).join('');
        const coveredGroups = new Set(selectedIngredients.flatMap(ing => ing.groups));
        const missingGroups = [...allAvailableGroups].filter(group => !coveredGroups.has(group));
        let missingGroupsHtml = '';
        if (missingGroups.length > 0) {
            missingGroupsHtml = `<div class="missing-groups"><h4>Missing Groups:</h4><small>${missingGroups.join(', ')}</small></div>`;
        }
        ingredientListDiv.innerHTML = `<h3>Selected Ingredients:</h3><ul>${listHtml}</ul>${missingGroupsHtml}`;
        addBtn.innerHTML = 'Add another ➕';
    };

    const renderSavedMeals = () => {
        savedMealsList.innerHTML = savedMeals.map((meal, index) => `
            <li>
                <span class="meal-name" data-index="${index}">${meal.name}</span>
                <button class="delete-meal-btn" data-index="${index}">🗑️</button>
            </li>
        `).join('');
    };

    // --- Core Logic ---

    const addRandomIngredients = (count) => {
        if (count <= 0) return;
        const selectedNames = new Set(selectedIngredients.map(ing => ing.name));
        const available = allIngredients.filter(ing => !selectedNames.has(ing.name));
        for (let i = available.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [available[i], available[j]] = [available[j], available[i]];
        }
        const newIngredients = available.slice(0, count).map(ing => ({ ...ing, pinned: false, isNew: true }));
        selectedIngredients.push(...newIngredients);
    };

    // --- Event Listeners ---

    generateBtn.addEventListener('click', () => {
        selectedIngredients = selectedIngredients.filter(ing => ing.pinned);
        selectedIngredients.forEach(ing => ing.isNew = false);
        const numToGenerate = 3 - selectedIngredients.length;
        addRandomIngredients(numToGenerate);
        renderIngredients();
    });

    addBtn.addEventListener('click', () => {
        const coveredGroups = new Set(selectedIngredients.flatMap(ing => ing.groups));
        const missingGroups = [...allAvailableGroups].filter(group => !coveredGroups.has(group));
        const selectedNames = new Set(selectedIngredients.map(ing => ing.name));
        let ingredientAdded = false;
        if (missingGroups.length > 0) {
            const shuffledMissing = [...missingGroups].sort(() => 0.5 - Math.random());
            for (const group of shuffledMissing) {
                const potential = allIngredients.filter(ing => ing.groups.includes(group) && !selectedNames.has(ing.name));
                if (potential.length > 0) {
                    const toAdd = potential[Math.floor(Math.random() * potential.length)];
                    selectedIngredients.push({ ...toAdd, pinned: false, isNew: true });
                    ingredientAdded = true;
                    break;
                }
            }
        }
        if (!ingredientAdded) addRandomIngredients(1);
        renderIngredients();
    });

    searchRecipesBtn.addEventListener('click', () => {
        if (selectedIngredients.length === 0) return;

        const ingredientTerms = selectedIngredients
            .map(ing => `"${ing.name.replace(/\p{Emoji}/gu, '').trim()}"`);
        
        const query = `toddler meal recipe ${ingredientTerms.join(' ')}`;
        
        const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        
        window.open(url, '_blank');
    });

    saveMealBtn.addEventListener('click', () => {
        if (selectedIngredients.length === 0) return;

        // Auto-generate the meal name
        const mealName = selectedIngredients
            .map(ing => ing.name.replace(/\p{Emoji}/gu, '').trim()) // Remove emojis and trim whitespace
            .sort((a, b) => a.localeCompare(b))
            .join(', ');

        if (savedMeals.some(meal => meal.name.toLowerCase() === mealName.toLowerCase())) {
            alert(`A meal named "${mealName}" already exists.`);
            return;
        }

        const newMeal = { 
            name: mealName, 
            ingredients: selectedIngredients.map(({ name, groups }) => ({ name, groups })) 
        };
        savedMeals.push(newMeal);
        saveMeals();
        renderSavedMeals();
        alert(`Meal saved as: "${mealName}"`);
    });

    ingredientListDiv.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (!button) return;
        const ingredientName = button.dataset.name;
        const index = selectedIngredients.findIndex(ing => ing.name === ingredientName);
        if (index === -1) return;

        if (button.classList.contains('pin-btn')) {
            selectedIngredients[index].pinned = !selectedIngredients[index].pinned;
        } else if (button.classList.contains('remove-btn')) {
            selectedIngredients.splice(index, 1);
            if (selectedIngredients.length < 3) addRandomIngredients(3 - selectedIngredients.length);
        }
        renderIngredients();
    });

    savedMealsList.addEventListener('click', (e) => {
        const target = e.target;
        const index = target.dataset.index;
        if (index === undefined) return;

        if (target.classList.contains('delete-meal-btn')) {
            if (confirm(`Are you sure you want to delete the meal "${savedMeals[index].name}"?`)) {
                savedMeals.splice(index, 1);
                saveMeals();
                renderSavedMeals();
            }
        } else if (target.classList.contains('meal-name')) {
            const meal = savedMeals[index];
            selectedIngredients = meal.ingredients.map(ing => ({ ...ing, pinned: false, isNew: true }));
            renderIngredients();
            savedMealsModal.style.display = 'none'; // Close modal on selection
        }
    });

    // --- Modal Logic ---

    // Ingredients Modal
    const ingredientsModal = document.getElementById('ingredientsModal');
    const ingredientsCloseBtn = ingredientsModal.querySelector('.close-btn');

    const populateModal = () => {
        const selectedNames = new Set(selectedIngredients.map(ing => ing.name));
        const listHtml = allIngredients.map(ing => {
            const isAdded = selectedNames.has(ing.name);
            return `
                <li>
                    <span><strong>${ing.name}</strong> <small>(${ing.groups.join(', ')})</small></span>
                    <div class="button-container">
                        <button class="add-to-meal-btn" data-name="${ing.name}" ${isAdded ? 'disabled' : ''}>${isAdded ? '✔️' : '➕'}</button>
                        <button class="remove-btn modal-remove" data-name="${ing.name}">🗑️</button>
                    </div>
                </li>
            `;
        }).join('');
        modalListDiv.innerHTML = `<ul>${listHtml}</ul>`;

        const groupsHtml = [...allAvailableGroups].map(group => `<label><input type="checkbox" name="group" value="${group}">${group}</label>`).join('');
        newIngredientGroupsDiv.innerHTML = groupsHtml;
    };

    viewAllBtn.addEventListener('click', () => {
        populateModal();
        ingredientsModal.style.display = 'block';
    });

    ingredientsCloseBtn.addEventListener('click', () => ingredientsModal.style.display = 'none');

    // Saved Meals Modal
    const savedMealsCloseBtn = savedMealsModal.querySelector('.close-btn');

    viewSavedBtn.addEventListener('click', () => {
        savedMealsModal.style.display = 'block';
    });

    savedMealsCloseBtn.addEventListener('click', () => savedMealsModal.style.display = 'none');

    // General modal close logic
    window.addEventListener('click', (e) => {
        if (e.target == ingredientsModal) ingredientsModal.style.display = 'none';
        if (e.target == savedMealsModal) savedMealsModal.style.display = 'none';
    });

    resetIngredientsBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset your ingredient list to the default? This cannot be undone.')) {
            localStorage.removeItem('userIngredients');
            loadIngredients();
        }
    });

    modalListDiv.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (!button) return;
        const ingredientName = button.dataset.name;

        if (button.classList.contains('modal-remove')) {
            allIngredients = allIngredients.filter(ing => ing.name !== ingredientName);
            saveIngredients();
            populateModal(); // Refresh the modal list
        } else if (button.classList.contains('add-to-meal-btn')) {
            const ingredientToAdd = allIngredients.find(ing => ing.name === ingredientName);
            if (ingredientToAdd) {
                selectedIngredients.push({ ...ingredientToAdd, pinned: false, isNew: true });
                renderIngredients();
                populateModal(); // Refresh buttons to show it's added
            }
        }
    });

    addIngredientForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = newIngredientNameInput.value.trim();
        if (!name) {
            alert('Ingredient name cannot be empty.');
            return;
        }
        if (allIngredients.some(ing => ing.name.toLowerCase() === name.toLowerCase())) {
            alert('This ingredient already exists.');
            return;
        }
        const selectedGroups = Array.from(newIngredientGroupsDiv.querySelectorAll('input[name="group"]:checked')).map(cb => cb.value);
        if (selectedGroups.length === 0) {
            alert('Please select at least one nutritional group.');
            return;
        }
        const newIngredient = { name: name, groups: selectedGroups };
        allIngredients.push(newIngredient);
        allIngredients.sort((a, b) => a.name.localeCompare(b.name));
        saveIngredients();
        populateModal();
        addIngredientForm.reset();
    });

    // Initial Load
    loadIngredients();
    loadSavedMeals();
    renderIngredients(); // Initial render to hide buttons
});
