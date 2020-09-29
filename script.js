const search = document.getElementById("search"),
  submit = document.getElementById("submit"),
  random = document.getElementById("random"),
  drinksEl = document.getElementById("drinks"),
  resultsHeading = document.getElementById("result-heading"),
  single_drinkEl = document.getElementById("single-drink");

function searchDrink(e) {
  e.preventDefault();

  // Clear single drink
  single_drinkEl.innerHTML = "";

  // Get search term from user
  const term = search.value;

  // Check if empty
  if (term.trim()) {
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${term}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        resultsHeading.innerHTML = `<h2>Search results for '${term}':</h2>`;

        // Check if results are null
        if (data.drinks === null) {
          resultsHeading.innerHTML = `<p>There are no search results. Please try again!</p>`;
        } else {
          drinksEl.innerHTML = data.drinks
            .map(
              (drink) => `
            <div class='drink'> 
              <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}"/>
              <div class="drink-info" data-drinkID="${drink.idDrink}">
                <h3>${drink.strDrink}</h3>
              </div>
            </div>
          `
            )
            .join("");
        }
      });
    // Clear sesarch text
    search.value = "";
  } else {
    alert("Please enter a search term");
  }
}

// Fetch drink by id
function getDrinkById(drinkId) {
  fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkId}
`)
    .then((res) => res.json())
    .then((data) => {
      const drink = data.drinks[0];

      addDrinkToDOM(drink);
      console.log(data);
    });
}

// Fetch random drink
function getRandomDrink() {
  // Clear drinks and heading
  drinksEl.innerHTML = "";
  resultsHeading.innerHTML = "";

  fetch(`https://www.thecocktaildb.com/api/json/v1/1/random.php
`)
    .then((res) => res.json())
    .then((data) => {
      const drink = data.drinks[0];

      addDrinkToDOM(drink);
    });
}

// Add drink to DOM
function addDrinkToDOM(drink) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (drink[`strIngredient${i}`]) {
      ingredients.push(
        `${drink[`strIngredient${i}`]} - ${drink[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }
  // Output single drink when clicked
  single_drinkEl.innerHTML = `
  <div class="single-drink">
    <h1>${drink.strDrink}</h1>
    <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}"
    <div class="single-meal-info">
      ${drink.strCategory ? `<p>${drink.strCategory}</p>` : ""}
      ${drink.strArea ? `<p>${drink.strArea}</p>` : ""}
    </div>
    <div class="main">
      <p>${drink.strInstructions}</p>
      <h2>Ingredients</h2>
      <ul class="ing-list">
        ${ingredients.map((ing) => `<li>${ing}</li>`).join("")}
      </ul>
    </div
  </div>
`;
}

// Event listeners
submit.addEventListener("submit", searchDrink);
random.addEventListener("click", getRandomDrink);

drinksEl.addEventListener("click", (e) => {
  const drinkInfo = e.path.find((item) => {
    if (item.classList) {
      return item.classList.contains("drink-info");
    } else {
      return false;
    }
  });
  if (drinkInfo) {
    const drinkId = drinkInfo.getAttribute("data-drinkid");
    getDrinkById(drinkId);
  }
});
