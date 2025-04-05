// DOM elements
const categoriesGrid = document.getElementById("categoriesGrid");
const newCategoryInput = document.getElementById("newCategory");
const addCategoryBtn = document.getElementById("addCategoryBtn");

// Function to load categories from the backend
async function loadCategories() {
    try {
        const response = await fetch("https://reach-out-pro-backend.vercel.app/categories");  // Assuming your server is running on localhost:3000
        const data = await response.json();

        if (data.success) {
            renderCategories(data.data);  // Pass the data array to the renderCategories function
        } else {
            console.error("Categories data is not available or incorrect format.");
        }
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
}

// Render all categories
function renderCategories(categories) {
    categoriesGrid.innerHTML = "";  // Clear existing content

    categories.forEach((category) => {
        const categoryCard = document.createElement("a");
        categoryCard.href = `messages.html?id=${category.name}`;
        categoryCard.className = "card-link";

        categoryCard.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <h2 class="card-title">${category.name}</h2>
                </div>
                <div class="card-content">
                    <p>${category.messages.length} messages</p>
                </div>
                <div class="card-footer">
                    <button class="button button-outline" style="width: 100%;">View Messages</button>
                </div>
            </div>
        `;

        categoriesGrid.appendChild(categoryCard);
    });
}

// Add new category
async function addCategory() {
    const categoryName = newCategoryInput.value.trim();

    if (categoryName) {
        const newCategory = {
            category: categoryName,
            messages: []  // Initially no messages
        };

        try {
            const response = await fetch("https://reach-out-pro-backend.vercel.app/add-Categories", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newCategory)
            });

            const data = await response.json();

            if (data.success) {
                loadCategories();  // Reload the categories after adding a new one
            } else {
                console.error("Failed to add category:", data.error);
            }
        } catch (error) {
            console.error("Error adding category:", error);
        }

        newCategoryInput.value = "";  // Clear input field
    }
}

// Event listeners
addCategoryBtn.addEventListener("click", addCategory);
newCategoryInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        addCategory();
    }
});

// Initialize
loadCategories();
