# Toddler Meal Idea Generator

A simple web application that helps generate meal ideas for toddlers by randomly selecting ingredients containing predefined nutrients (Fiber, Vitamins, Protein, etc.)

## Live Demo

You can try the application live at: [https://mick88.github.io/meal-planner/](https://mick88.github.io/meal-planner/)

## Features

- **Dynamic Meal Generation:** Get a set of random ingredients to spark a meal idea.
- **Intelligent Suggestions:** The "Add ingredient" button smartly suggests ingredients that fulfill missing nutritional groups.
- **Pin Ingredients:** Pin your favorite ingredients to keep them in the list for the next generation.
- **Save & Recall Meals:** Save your favorite ingredient combinations as named meals and recall them instantly from the "My Meals" popup.
- **Recipe Search:** Automatically search Google for recipes using your currently selected ingredients.
- **Ingredient Discovery:** Hover over an ingredient to see a tooltip with suggestions for other ingredients with similar nutritional profiles.
- **Full Ingredient Management:**
    - View all available ingredients in a popup.
    - Add your own custom ingredients with specific nutritional groups.
    - Remove ingredients from the master list.
    - Reset the ingredient list back to the application defaults.
- **Modern UI:** A clean, responsive interface

## How to Use

1.  Open the live demo link above or clone the repository and open the `index.html` file in your web browser.
2.  Click the **Generate ✨** button to get your first set of ingredients.
3.  Use the buttons within the meal card to **Add another ➕**, **Save as Meal 💾**, or **Search for Recipes 🍳**.
4.  Use the **My Meals 📂** and **View All Ingredients 📋** buttons to manage your data.

## Project Structure

- `index.html`: The main HTML file that structures the web page.
- `styles.css`: Contains all the styling, including layout, Material Design implementation, and animations.
- `planner.js`: The core JavaScript logic that handles all application functionality.
- `ingredients.json`: The default structured list of all available ingredients and their nutritional groups.
- `.github/workflows/deploy.yml`: A GitHub Actions workflow that automatically deploys the project as a static web page using GitHub Pages.

---

## Disclaimer

**AI-Generated Project:** This project was created and iteratively developed with the assistance of a large language model (AI). 

**Nutritional Information:** The ingredient data and nutritional group classifications are for demonstration purposes only and have not been verified for accuracy. Please consult a qualified professional for dietary advice.
