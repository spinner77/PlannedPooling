

// Toggle for What is Planned Pooling
const toggleInfoButton = document.getElementById("toggle-info-btn");
const infoContent = document.getElementById("info-content");

toggleInfoButton.addEventListener("click", () => {
    const isExpanded = toggleInfoButton.getAttribute("aria-expanded") === "true";
    toggleInfoButton.setAttribute("aria-expanded", !isExpanded);
    infoContent.style.display = isExpanded ? "none" : "block";
    toggleInfoButton.textContent = isExpanded ? "Learn More" : "Show Less";
});

// Toggle for How to Use This App
const toggleInstructionsButton = document.getElementById("toggle-instructions-btn");
const instructionsContent = document.getElementById("instructions-content");

toggleInstructionsButton.addEventListener("click", () => {
    const isExpanded = toggleInstructionsButton.getAttribute("aria-expanded") === "true";
    toggleInstructionsButton.setAttribute("aria-expanded", !isExpanded);
    instructionsContent.style.display = isExpanded ? "none" : "block";
    toggleInstructionsButton.textContent = isExpanded ? "Learn More" : "Show Less";
});

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

// Calculate the width of the final blanket
document.getElementById("calculate-width").addEventListener("click", function () {
    const swatchWidth = parseFloat(document.getElementById("swatch-width").value);
    const stitchesPerRow = parseInt(document.getElementById("stitches-across-input").value);

    if (isNaN(swatchWidth) || swatchWidth <= 0) {
        alert("Please enter a valid positive number for the swatch width.");
        return;
    }
    if (isNaN(stitchesPerRow) || stitchesPerRow <= 0) {
        alert("Please enter a valid number of stitches in the row in the Color Picker section.");
        return;
    }

    const singleStitchWidth = swatchWidth / 10;
    const blanketWidth = singleStitchWidth * stitchesPerRow;
    const blanketWidthCm = (blanketWidth / 10).toFixed(2);

    document.getElementById("blanket-width").textContent = blanketWidth.toFixed(2);
    document.getElementById("blanket-width-cm").textContent = blanketWidthCm;
});

document.getElementById('stitches-across-input').addEventListener('input', generateGrid);

// Save Grid as Image
document.getElementById('save-grid-btn').addEventListener('click', function() {
    const gridElement = document.getElementById('grid');

    html2canvas(gridElement, {
        backgroundColor: null,
        scale: 2,
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'planned-pooling-grid.png';

        canvas.toBlob(function(blob) {
            link.href = URL.createObjectURL(blob);
            link.click();
            URL.revokeObjectURL(link.href);
        }, 'image/png');
    });
});

// Generate Grid
function generateGrid() {
    const gridContainer = document.getElementById('grid');
    gridContainer.innerHTML = '';

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
    let stitchIndex = 0;
    let currentStitchCount = 0;

    for (let row = gridHeight - 1; row >= 0; row--) {
        for (let col = 0; col < stitchesAcross; col++) {
            if (currentStitchCount >= stitches[stitchIndex]) {
                stitchIndex = (stitchIndex + 1) % stitches.length;
                currentStitchCount = 0;
            }

            const square = document.createElement('div');
            square.classList.add('grid-square');
            square.style.backgroundColor = colors[stitchIndex];
            gridContainer.appendChild(square);

            currentStitchCount++;
        }
    }

    const gridWidthInPixels = Math.min(stitchesAcross * 20, window.innerWidth - 40);
    gridContainer.style.gridTemplateColumns = `repeat(${stitchesAcross}, 1fr)`;
    gridContainer.style.width = `${gridWidthInPixels}px`;
}

