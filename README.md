# Toddler Meal Idea Generator

A simple web application that helps generate meal ideas for toddlers by randomly selecting ingredients. It ensures nutritional variety by considering different food groups.

## Features

- **Generate Meal Ideas:** Get a set of three random ingredients to spark a meal idea.
- **Add More Ingredients:** Add more unique ingredients to the list one by one.
- **Nutritional Info:** See which nutritional groups (like Iron, Protein, etc.) each ingredient belongs to.
- **Simple UI:** A clean, modern, and responsive user interface.

## How to Use

1.  Clone the repository to your local machine.
2.  Open the `planner.html` file directly in your web browser.
3.  Click the **Generate ✨** button to get your first set of ingredients.
4.  Click the **Add another ➕** button to add more ingredients to the list.

## Project Structure

- `planner.html`: The main HTML file that structures the web page.
- `styles.css`: Contains all the styling, including layout and animations.
- `planner.js`: The core JavaScript logic that handles ingredient selection, button clicks, and dynamic updates.
- `ingredients.json`: A structured list of all available ingredients and the nutritional groups they belong to.
- `.github/workflows/deploy.yml`: A GitHub Actions workflow that automatically deploys the project as a static web page using GitHub Pages.
