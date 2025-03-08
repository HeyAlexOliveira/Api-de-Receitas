const apiBaseUrl = "http://localhost:3000/receitas";
const searchInput = document.querySelector(".search-container input[type='text']");
const searchButton = document.querySelector(".search-container button");
const resultsDiv = document.querySelector(".results");

function displayRecipes(recipes) {
  resultsDiv.innerHTML = ""; 

  if (recipes.length === 0) {
    resultsDiv.innerHTML = "<p>Nenhuma receita encontrada.</p>";
    return;
  }

  recipes.forEach((recipe) => {
    const recipeCard = document.createElement("div");
    recipeCard.classList.add("recipe-card");
    recipeCard.innerHTML = `
      <h2>${recipe.nome_receita}</h2>
      <p><strong>Ingredientes:</strong> ${recipe.ingredientes}</p>
      <p><strong>Modo de Preparo:</strong> ${recipe.modo_preparo}</p>
      <p><strong>Tempo de Preparo:</strong> ${recipe.tempo_preparo} minutos</p>
      <button class="update-recipe" data-id="${recipe.id}">Editar</button>
      <button class="delete-recipe" data-id="${recipe.id}">Excluir</button>
    `;
    resultsDiv.appendChild(recipeCard);
  });

  document.querySelectorAll(".update-recipe").forEach((button) =>
    button.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      const updatedRecipe = {
        nome_receita: prompt("Novo nome da receita:"),
        ingredientes: prompt("Novos ingredientes:"),
        modo_preparo: prompt("Novo modo de preparo:"),
        tempo_preparo: parseInt(prompt("Novo tempo de preparo (minutos):"), 10),
      };
      updateRecipe(id, updatedRecipe);
    })
  );

  document.querySelectorAll(".delete-recipe").forEach((button) =>
    button.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      deleteRecipe(id);
    })
  );
}

async function fetchRecipes(query) {
  try {
    resultsDiv.innerHTML = "<p>Carregando...</p>"; 

    const response = await fetch(`${apiBaseUrl}/buscar/nome?nome=${query}`);
    if (!response.ok) {
      throw new Error("Erro ao buscar receitas.");
    }

    const recipes = await response.json();
    displayRecipes(recipes);
  } catch (error) {
    resultsDiv.innerHTML = `<p>Erro ao buscar receitas: ${error.message}</p>`;
    console.error(error);
  }
}

async function fetchAllRecipes() {
  try {
    const response = await fetch(apiBaseUrl); 
    if (!response.ok) throw new Error("Erro ao carregar as receitas");

    const recipes = await response.json();
    displayRecipes(recipes); 
  } catch (error) {
    console.error(error);
    resultsDiv.innerHTML = `<p>Erro ao carregar receitas: ${error.message}</p>`;
  }
}

async function addRecipe(recipe) {
  try {
    const response = await fetch(apiBaseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(recipe),
    });

    if (!response.ok) throw new Error("Erro ao adicionar a receita");

    alert("Receita adicionada com sucesso!");
    fetchAllRecipes();
  } catch (error) {
    console.error(error);
    alert(`Erro: ${error.message}`);
  }
}

async function updateRecipe(id, updatedRecipe) {
  try {
    const response = await fetch(`${apiBaseUrl}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedRecipe),
    });

    if (!response.ok) throw new Error("Erro ao atualizar a receita");

    alert("Receita atualizada com sucesso!");
    fetchAllRecipes();
  } catch (error) {
    console.error(error);
    alert(`Erro: ${error.message}`);
  }
}

async function deleteRecipe(id) {
  try {
    const response = await fetch(`${apiBaseUrl}/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Erro ao deletar a receita");

    alert("Receita deletada com sucesso!");
    fetchAllRecipes();
  } catch (error) {
    console.error(error);
    alert(`Erro: ${error.message}`);
  }
}

searchButton.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) {
    fetchRecipes(query);
  } else {
    resultsDiv.innerHTML = "<p>Por favor, insira o nome de uma receita.</p>";
  }
});

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const query = searchInput.value.trim();
    if (query) {
      fetchRecipes(query);
    } else {
      resultsDiv.innerHTML = "<p>Por favor, insira o nome de uma receita.</p>";
    }
  }
});

document.querySelector("button#adicionar").addEventListener("click", () => {
  const novaReceita = {
    nome_receita: prompt("Nome da receita:"),
    ingredientes: prompt("Ingredientes:"),
    modo_preparo: prompt("Modo de preparo:"),
    tempo_preparo: parseInt(prompt("Tempo de preparo (minutos):"), 10),
  };
  addRecipe(novaReceita);
});

document.addEventListener("DOMContentLoaded", fetchAllRecipes);
