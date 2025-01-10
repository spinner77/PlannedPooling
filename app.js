document.getElementById('add-color-btn').addEventListener('click', function() {
    const colorInputsDiv = document.getElementById('color-inputs');

    // Create a new div to hold the color picker, stitches input, and remove button
    const newColorDiv = document.createElement('div');
    newColorDiv.classList.add('color-input-group');

    // Create the color picker input
    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.name = 'color';
    colorPicker.classList.add('color-picker');
    colorPicker.title = 'Select a color';
    colorPicker.addEventListener('input', generateGrid); // Update grid on color change

    // Create the number of stitches input
    const stitchesInput = document.createElement('input');
    stitchesInput.type = 'number';
    stitchesInput.name = 'stitches';
    stitchesInput.placeholder = 'Number of stitches';
    stitchesInput.classList.add('stitches-input');
    stitchesInput.title = 'Enter the number of stitches for this color';
    stitchesInput.addEventListener('input', generateGrid); // Update grid on stitches change

    // Create the remove button
    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.classList.add('remove-color-btn');
    removeButton.textContent = 'Remove';
    removeButton.title = 'Remove this color';
    removeButton.addEventListener('click', function() {
        newColorDiv.remove();
        generateGrid(); // Update the grid after removing a color
    });

    // Append the inputs and remove button to the new div
    newColorDiv.appendChild(colorPicker);
    newColorDiv.appendChild(stitchesInput);
    newColorDiv.appendChild(removeButton);

    // Append the new div to the color inputs container
    colorInputsDiv.appendChild(newColorDiv);
});

document.getElementById('stitches-across-input').addEventListener('input', generateGrid);

function generateGrid() {
    const gridContainer = document.getElementById('grid');
    gridContainer.innerHTML = ''; // Clear existing grid

    const stitchesAcross = parseInt(document.getElementById('stitches-across-input').value);
    if (isNaN(stitchesAcross) || stitchesAcross <= 0) return;

    const colorInputs = document.querySelectorAll('.color-input-group');
    const colors = [];
    const stitches = [];

    colorInputs.forEach(group => {
        const color = group.querySelector('.color-picker').value;
        const stitchCount = parseInt(group.querySelector('.stitches-input').value);
        if (color && !isNaN(stitchCount) && stitchCount > 0) {
            colors.push(color);
            stitches.push(stitchCount);
        }
    });

    if (colors.length === 0 || stitches.length === 0) return;

    const gridHeight = 20;
    const gridWidth = stitchesAcross;
    const totalSquares = gridHeight * gridWidth;

    let stitchIndex = 0;
    let currentStitchCount = 0;

    // Create a 2D array to store the grid squares
    const gridSquares = Array.from({ length: gridHeight }, () => Array(gridWidth).fill(null));

    for (let row = gridHeight - 1; row >= 0; row--) {
        if (row % 2 !== 0) {
            // Left to right
            for (let col = 0; col < gridWidth; col++) {
                if (currentStitchCount >= stitches[stitchIndex]) {
                    stitchIndex = (stitchIndex + 1) % stitches.length;
                    currentStitchCount = 0;
                }

                const square = document.createElement('div');
                square.classList.add('grid-square');
                square.style.backgroundColor = colors[stitchIndex];
                gridSquares[row][col] = square;

                currentStitchCount++;
            }
        } else {
            // Right to left
            for (let col = gridWidth - 1; col >= 0; col--) {
                if (currentStitchCount >= stitches[stitchIndex]) {
                    stitchIndex = (stitchIndex + 1) % stitches.length;
                    currentStitchCount = 0;
                }

                const square = document.createElement('div');
                square.classList.add('grid-square');
                square.style.backgroundColor = colors[stitchIndex];
                gridSquares[row][col] = square;

                currentStitchCount++;
            }
        }
    }

    // Append the grid squares to the grid container
    gridSquares.forEach(row => {
        row.forEach(square => {
            gridContainer.appendChild(square);
        });
    });

    // Set the grid template columns and rows
    gridContainer.style.gridTemplateColumns = `repeat(${gridWidth}, 1fr)`;
    gridContainer.style.gridTemplateRows = `repeat(${gridHeight}, 1fr)`;
}