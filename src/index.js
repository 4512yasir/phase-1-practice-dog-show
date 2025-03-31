document.addEventListener("DOMContentLoaded", () => {
    const dogTable = document.getElementById("table-body");
    const dogForm = document.getElementById("dog-form");

    let editingDog = null; // Store the current dog being edited

    // Fetch and display all dogs
    function fetchDogs() {
        fetch("http://localhost:3000/dogs")
            .then(response => response.json())
            .then(dogs => renderDogs(dogs))
            .catch(error => console.error("Error fetching dogs:", error));
    }

    // Render all dogs in the table
    function renderDogs(dogs) {
        dogTable.innerHTML = ""; // Clear table before re-rendering
        dogs.forEach(dog => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${dog.name}</td>
                <td>${dog.breed}</td>
                <td>${dog.sex}</td>
                <td><button class="edit-btn" data-id="${dog.id}">Edit</button></td>
            `;
            dogTable.appendChild(tr);

            // Add event listener to the Edit button
            tr.querySelector(".edit-btn").addEventListener("click", () => populateForm(dog));
        });
    }

    // Populate the form with the selected dog's data
    function populateForm(dog) {
        dogForm.name.value = dog.name;
        dogForm.breed.value = dog.breed;
        dogForm.sex.value = dog.sex;
        editingDog = dog; // Store the current dog being edited
    }

    // Handle form submission for updating dog info
    dogForm.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!editingDog) return; // Ensure a dog is selected for editing

        const updatedDog = {
            name: dogForm.name.value,
            breed: dogForm.breed.value,
            sex: dogForm.sex.value
        };

        // Send PATCH request to update dog info
        fetch(`http://localhost:3000/dogs/${editingDog.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedDog)
        })
        .then(response => response.json())
        .then(() => {
            fetchDogs(); // Re-fetch and render all dogs after update
            dogForm.reset(); // Clear the form
            editingDog = null; // Reset editing dog
        })
        .catch(error => console.error("Error updating dog:", error));
    });

    // Initialize app
    fetchDogs();
});
