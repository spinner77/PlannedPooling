document.getElementById('add-color-btn').addEventListener('click', function() {
    const colorInputsDiv = document.getElementById('color-inputs');

    const newColorDiv = document.createElement('div');
    newColorDiv.classList.add('color-input-group');

    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.name = 'color';
    colorPicker.classList.add('color-picker');
    colorPicker.title = 'Select a color';
    colorPicker.addEventListener('input', generateGrid);

    const stitchesInput = document.createElement('input');
    stitchesInput.type = 'number';
    stitchesInput.name = 'stitches';
    stitchesInput.placeholder = 'Number of stitches';
    stitchesInput.classList.add('stitches-input');
    stitchesInput.title = 'Enter the number of stitches for this color';
    stitchesInput.addEventListener('input', generateGrid);

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.classList.add('remove-color-btn');
    removeButton.textContent = 'Remove';
    removeButton.title = 'Remove this color';
    removeButton.addEventListener('click', function() {
        newColorDiv.remove();
        generateGrid(); // Update grid after removal
    });

    newColorDiv.appendChild(colorPicker);
    newColorDiv.appendChild(stitchesInput);
    newColorDiv.appendChild(removeButton);

    colorInputsDiv.appendChild(newColorDiv);
});

document.getElementById("calculate-width").addEventListener("click", function () {
    // Get input values
    const swatchWidth = parseFloat(document.getElementById("swatch-width").value);
    const stitchesPerRow = parseInt(document.getElementById("stitches-across-input").value);

    // Validate inputs
    if (isNaN(swatchWidth) || swatchWidth <= 0) {
        alert("Please enter a valid positive number for the swatch width.");
        return;
    }
    if (isNaN(stitchesPerRow) || stitchesPerRow <= 0) {
        alert("Please enter a valid number of stitches in the row in the Color Picker section.");
        return;
    }

    // Calculate the final blanket width
    const singleStitchWidth = swatchWidth / 10; // Width of a single stitch
    const blanketWidth = singleStitchWidth * stitchesPerRow; // Final blanket width in mm
    const blanketWidthCm = (blanketWidth / 10).toFixed(2); // Convert to cm

    // Display the result
    document.getElementById("blanket-width").textContent = blanketWidth.toFixed(2);
    document.getElementById("blanket-width-cm").textContent = blanketWidthCm;
});

document.getElementById('stitches-across-input').addEventListener('input', generateGrid);

document.getElementById('save-grid-btn').addEventListener('click', function() {
    const gridElement = document.getElementById('grid');
    
    html2canvas(gridElement, {
        backgroundColor: null,
        scale: 2, // Increase quality
    }).then(canvas => {
        // Create temporary link element
        const link = document.createElement('a');
        link.download = 'planned-pooling-grid.png';
        
        // Convert canvas to blob
        canvas.toBlob(function(blob) {
            link.href = URL.createObjectURL(blob);
            link.click(); // Trigger download
            
            // Cleanup
            URL.revokeObjectURL(link.href);
        }, 'image/png');
    });
});
function calculateSwatchMeasurements() {
    const swatchWidth = parseFloat(document.getElementById('swatch-width').value);
    const stitchesAcross = parseInt(document.getElementById('stitches-across-input').value);
    
    if (!swatchWidth || !stitchesAcross) return;
    
    const singleStitchWidth = swatchWidth / 10; // Since swatch is 10 stitches
    const projectWidthMM = singleStitchWidth * stitchesAcross;
    const projectWidthCM = projectWidthMM / 10;
    
    document.getElementById('stitch-width').textContent = singleStitchWidth.toFixed(1);
    document.getElementById('project-width').textContent = projectWidthMM.toFixed(1);
    document.getElementById('project-width-cm').textContent = projectWidthCM.toFixed(1);
}

// Add event listeners for swatch calculator inputs
['swatch-width', 'swatch-height', 'hook-size', 'yarn-weight'].forEach(id => {
    document.getElementById(id).addEventListener('input', calculateSwatchMeasurements);
});

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

    const gridHeight = 20; // Fixed height
    const gridWidth = stitchesAcross;

    let stitchIndex = 0;
    let currentStitchCount = 0;

    const gridSquares = Array.from({ length: gridHeight }, () => Array(gridWidth).fill(null));

    // Create a 2D array for the grid squares
    for (let row = gridHeight - 1; row >= 0; row--) {
        if (row % 2 !== 0) {
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

    // Append the grid squares to the container
    gridSquares.forEach(row => {
        row.forEach(square => {
            gridContainer.appendChild(square);
        });
    });

    // Adjust grid container size based on the number of columns
    const gridWidthInPixels = Math.min(gridWidth * 20, window.innerWidth - 40); // Limit the max width of the grid
    gridContainer.style.gridTemplateColumns = `repeat(${gridWidth}, 1fr)`;
    gridContainer.style.gridTemplateRows = `repeat(${gridHeight}, 1fr)`;
    gridContainer.style.width = `${gridWidthInPixels}px`; // Adjust grid width dynamically
}
