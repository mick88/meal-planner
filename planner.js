document.addEventListener('DOMContentLoaded', () => {
    // Element references
    const generateBtn = document.getElementById('generateBtn');
    const addBtn = document.getElementById('addBtn');
    const ingredientListDiv = document.getElementById('ingredient-list');
    const modal = document.getElementById('ingredientsModal');
    const viewAllBtn = document.getElementById('viewAllBtn');
    const closeBtn = document.querySelector('.close-btn');
    const modalListDiv = document.getElementById('modal-ingredient-list');
    const resetIngredientsBtn = document.getElementById('resetIngredientsBtn');
    const addIngredientForm = document.getElementById('add-ingredient-form');
    const newIngredientNameInput = document.getElementById('new-ingredient-name');
    const newIngredientGroupsDiv = document.getElementById('new-ingredient-groups');

    // State variables
    let allIngredients = [];
    let selectedIngredients = [];
    let allAvailableGroups = new Set();

    // --- Data Management ---

    const saveIngredients = () => {
        localStorage.setItem('userIngredients', JSON.stringify(allIngredients));
    };

    const initializeApp = (data) => {
        allIngredients = data;
        allAvailableGroups.clear();
        allIngredients.forEach(ing => ing.groups.forEach(group => allAvailableGroups.add(group)));
        if (modal.style.display === 'block') {
            populateModal();
        }
    };

    const loadIngredients = () => {
        const userIngredients = localStorage.getItem('userIngredients');
        if (userIngredients) {
            initializeApp(JSON.parse(userIngredients));
        } else {
            fetch('ingredients.json')
                .then(response => response.json())
                .then(data => initializeApp(data));
        }
    };

    // --- Rendering ---

    const renderIngredients = () => {
        if (selectedIngredients.length === 0) {
            ingredientListDiv.innerHTML = '<p>Click the button to get a meal idea!</p>';
            addBtn.style.display = 'none';
            return;
        }

        const listHtml = selectedIngredients.map(ing => {
            const pinnedClass = ing.pinned ? 'pinned' : '';
            const newClass = ing.isNew ? 'new-ingredient' : '';
            ing.isNew = false;
            return `
                <li class="${newClass}">
                    <div class="ingredient-info"><strong>${ing.name}</strong><small>${ing.groups.join(', ')}</small></div>
                    <div class="button-container">
                        <button class="pin-btn ${pinnedClass}" data-name="${ing.name}">📌</button>
                        <button class="remove-btn" data-name="${ing.name}">🗑️</button>
                    </div>
                </li>
            `;
        }).join('');

        const coveredGroups = new Set(selectedIngredients.flatMap(ing => ing.groups));
        const missingGroups = [...allAvailableGroups].filter(group => !coveredGroups.has(group));
        let missingGroupsHtml = '';
        if (missingGroups.length > 0) {
            missingGroupsHtml = `<div class="missing-groups"><h4>Missing Groups:</h4><small>${missingGroups.join(', ')}</small></div>`;
        }

        ingredientListDiv.innerHTML = `<h3>Selected Ingredients:</h3><ul>${listHtml}</ul>${missingGroupsHtml}`;
        addBtn.innerHTML = 'Add another ➕';
        addBtn.style.display = 'inline-block';
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

    // --- Modal Logic ---

    const populateModal = () => {
        // Populate ingredient list
        const listHtml = allIngredients.map(ing => `
            <li>
                <span><strong>${ing.name}</strong> <small>(${ing.groups.join(', ')})</small></span>
                <button class="remove-btn modal-remove" data-name="${ing.name}">🗑️</button>
            </li>
        `).join('');
        modalListDiv.innerHTML = `<ul>${listHtml}</ul>`;

        // Populate checkboxes for adding new ingredients
        const groupsHtml = [...allAvailableGroups].map(group => `
            <label>
                <input type="checkbox" name="group" value="${group}">
                ${group}
            </label>
        `).join('');
        newIngredientGroupsDiv.innerHTML = groupsHtml;
    };

    viewAllBtn.addEventListener('click', () => {
        populateModal();
        modal.style.display = 'block';
    });

    closeBtn.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target == modal) modal.style.display = 'none';
    });

    resetIngredientsBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset your ingredient list to the default? This cannot be undone.')) {
            localStorage.removeItem('userIngredients');
            loadIngredients();
        }
    });

    modalListDiv.addEventListener('click', (e) => {
        const button = e.target.closest('.modal-remove');
        if (!button) return;
        const ingredientName = button.dataset.name;
        allIngredients = allIngredients.filter(ing => ing.name !== ingredientName);
        saveIngredients();
        populateModal(); // Refresh the modal list
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
        allIngredients.sort((a, b) => a.name.localeCompare(b.name)); // Keep the list sorted
        
        saveIngredients();
        populateModal(); // Refresh the view
        addIngredientForm.reset(); // Clear the form
    });

    // Initial Load
    loadIngredients();
});