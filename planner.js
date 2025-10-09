
// Get references to the HTML elements
const generateBtn = document.getElementById('generateBtn');
const resultDiv = document.getElementById('result');

// Add a click event listener to the button
generateBtn.addEventListener('click', () => {
    fetch('ingredients.json')
        .then(response => response.json())
        .then(data => {
            const { Iron, Protein, "Vitamin C": VitaminC, "Vitamin B12": VitaminB12, Fiber } = data;

            // Function to pick a random item from an array
            const getRandomItem = (arr) => {
                const randomIndex = Math.floor(Math.random() * arr.length);
                return arr[randomIndex];
            };

            // Pick one random ingredient from each group
            const randomIron = getRandomItem(Iron);
            const randomProtein = getRandomItem(Protein);
            const randomVitaminC = getRandomItem(VitaminC);
            const randomVitaminB12 = getRandomItem(VitaminB12);
            const randomFiber = getRandomItem(Fiber);

            // Display the result in the resultDiv
            resultDiv.innerHTML = `
                <ul>
                    <li><b>Iron:</b> ${randomIron}</li>
                    <li><b>Protein:</b> ${randomProtein}</li>
                    <li><b>Vitamin C:</b> ${randomVitaminC}</li>
                    <li><b>Vitamin B12:</b> ${randomVitaminB12}</li>
                    <li><b>Fiber:</b> ${randomFiber}</li>
                </ul>
            `;
        });
});