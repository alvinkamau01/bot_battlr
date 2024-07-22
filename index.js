document.addEventListener('DOMContentLoaded', () => {
    const characterForm = document.getElementById('characterForm');
    const characterList = document.getElementById('characterList');

    
    async function fetchAndDisplayCharacters() {
        try {
            const response = await fetch('http://localhost:3000/characters');
            if (!response.ok) {
                throw new Error('Failed to fetch characters');
            }
            const characters = await response.json();
            characters.forEach(character => {
                displayCharacter(character);
            });
        } catch (error) {
            console.error('Error fetching characters:', error);
        }
    }


    function displayCharacter(character) {
        const characterDiv = document.createElement('div');
        characterDiv.id='characterDiv'
        characterDiv.classList.add('character');
        characterDiv.dataset.id = character._id; // Assign data-id attribute

        const name = document.createElement('h2');
        name.textContent = character.name;
        name.id='actualname'
        characterDiv.appendChild(name);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
             deleteCharacter(`${character.id}`); 
            characterDiv.remove(); 
        });
        characterDiv.appendChild(deleteButton);

        const updateButton = document.createElement('button');
        updateButton.textContent = 'Update';
        updateButton.addEventListener('click', () => {
            openUpdateForm(character);
            

        });
        updateButton.style.marginLeft = "10px";
        characterDiv.appendChild(updateButton);
        characterList.appendChild(characterDiv);
    }

    
    characterForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const name = document.getElementById('name').value.trim();
        

        if (name === '') {
            alert('Please fill out all fields');
            return;
        }

        const newCharacter = { name }

        try {
            const response = await fetch('http://localhost:3000/characters', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newCharacter),
            });
            if (!response.ok) {
                throw new Error('Failed to add character');
            }
            const data = await response.json();
            displayCharacter(data); 
            characterForm.reset(); 
        } catch (error) {
            console.error('Error adding character:', error);
        }
    });

    

    function openUpdateForm(character) {
        const updateForm = document.createElement('form');
        updateForm.innerHTML = `
            <label for="updateName">Name:</label>
            <input type="text" id="updateName" value="${character.name}">
            <button type="submit">Submit Update</button>
        `;
        
        updateForm.addEventListener('submit', async (event) => {
            event.preventDefault();
           
            const updatedCharacter = document.getElementById('updateName').value
            try {
                const response = await fetch(`http://localhost:3000/characters/${updatedCharacter._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedCharacter),
                });
                if (!response.ok) {
                    throw new Error('Failed to update character');
                }
                const updatedData = await response.json();
                updateCharacterOnUI(updatedData); 
                updateForm.remove(); 
            } catch (error) {
                console.error('Error updating character:', error);
            }
        });
        
        
        document.body.appendChild(updateForm);
        
        
        function updateCharacterOnUI(updatedCharacter) {
            const characterDiv = document.querySelector(`.character[data-id="${updatedCharacter._id}"]`);
            if (characterDiv) {
                characterDiv.querySelector('h2').textContent = updatedCharacter.name;
              
            }
        }
        
    }

    
    async function deleteCharacter(characterId) {
        try {
            const response = await fetch(`http://localhost:3000/characters/${characterId}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Failed to delete character')
            }
        } catch (error) {
            console.error('Error deleting character:', error)
        }
    }

    
    fetchAndDisplayCharacters()
})