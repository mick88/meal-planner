
// Get references to the HTML elements
const generateBtn = document.getElementById('generateBtn');
const resultDiv = document.getElementById('result');

// Add a click event listener to the button
generateBtn.addEventListener('click', () => {
    fetch('ingredients.json')
        .then(response => response.json())
        .then(data => {
            const { proteins, carbs, veggiesAndFruits, dairyAndFats } = data;

            // Function to pick a random item from an array
            const getRandomItem = (arr) => {
                const randomIndex = Math.floor(Math.random() * arr.length);
                return arr[randomIndex];
            };

            // Pick one random ingredient from each group
            const randomProtein = getRandomItem(proteins);
            const randomCarb = getRandomItem(carbs);
            const randomVeggie = getRandomItem(veggiesAndFruits);
            const randomDairyFat = getRandomItem(dairyAndFats);

            // Display the result in the resultDiv
            resultDiv.innerHTML = `
                <ul>
                    <li><b>Protein:</b> ${randomProtein}</li>
                    <li><b>Carb:</b> ${randomCarb}</li>
                    <li><b>Veg/Fruit:</b> ${randomVeggie}</li>
                    <li><b>Dairy/Fat:</b> ${randomDairyFat}</li>
                </ul>
            `;
        });
});