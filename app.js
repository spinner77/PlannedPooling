document.getElementById('add-color-btn').addEventListener('click', function() {
    const colorInputsDiv = document.getElementById('color-inputs');

    // Create a new div to hold the color picker and stitches input
    const newColorDiv = document.createElement('div');
    newColorDiv.classList.add('color-input-group');

    // Create the color picker input
    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.name = 'color';
    colorPicker.classList.add('color-picker');
    colorPicker.title = 'Select a color';

    // Create the number of stitches input
    const stitchesInput = document.createElement('input');
    stitchesInput.type = 'number';
    stitchesInput.name = 'stitches';
    stitchesInput.placeholder = 'Number of stitches';
    stitchesInput.classList.add('stitches-input');
    stitchesInput.title = 'Enter the number of stitches for this color';

    // Append the inputs to the new div
    newColorDiv.appendChild(colorPicker);
    newColorDiv.appendChild(stitchesInput);

    // Append the new div to the color inputs container
    colorInputsDiv.appendChild(newColorDiv);
});