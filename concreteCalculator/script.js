
let wallCount = 1;
const wallContainer = document.getElementById('wall-container');
const addWallButton = document.getElementById('add-wall');
const calculateButton = document.getElementById('calculate');
const resultFeetDiv = document.getElementById('resultYards');
const resultYardsDiv = document.getElementById('resultFeet');

function wallContainerHtml(dimension, wallCount){
    // return `<label for="${dimension}${wallCount}"> ${dimension}:</label>
    return `<input type="number" placeholder="${dimension} feet" id="${dimension}feet${wallCount}">
    <input type="number" placeholder="${dimension} inches" id="${dimension}inches${wallCount}">`;
}

function getDimension(dimension, i){
    let feet = parseFloat(document.getElementById(`${dimension}feet${i}`).value);
    let inches = parseFloat(document.getElementById(`${dimension}inches${i}`).value);
    feet = isNaN(feet) ? 0 : feet;
    inches = isNaN(inches) ? 0 : inches;
    return [feet, inches];
}

function inchesToFeet(inches){
    const feet = inches / 12;
    return feet;
}

function feet(feet, inches){
    return feet + inchesToFeet(inches)
}

addWallButton.addEventListener('click', () => {
    wallCount++;
    const newWall = document.createElement('div');
    const dimensions = ['length', 'width', 'height']
    newWall.innerHTML = `Wall ${wallCount} ` +  dimensions.map(dimension => wallContainerHtml(dimension, wallCount)).join(' ');
    wallContainer.appendChild(newWall);
});

calculateButton.addEventListener('click', () => {
    let totalVolumeFeet = 0;
    let totalVolumeYards = 0;
    for (let i = 1; i <= wallCount; i++) {
        let lengthFeet, lengthInches, widthFeet, widthInches, heightFeet, heightInches, prevWidthFeet, prevWidthInches;
        [lengthFeet, lengthInches] = getDimension('length', i);
        [widthFeet, widthInches] = getDimension('width', i);
        [heightFeet, heightInches] = getDimension('height', i);
        const prevIndex = (i === 1) ? wallCount : i - 1;
        [prevWidthFeet, prevWidthInches] = getDimension('width', prevIndex);
        totalVolumeFeet += (feet(lengthFeet, lengthInches) - feet(prevWidthFeet, prevWidthInches)) * feet(widthFeet, widthInches) * feet(heightFeet, heightInches);
    }
    totalVolumeYards = totalVolumeFeet * 1/3 * 1/3 * 1/3;
    resultYardsDiv.textContent = `${totalVolumeYards.toFixed(2)} cubic Yards`;
    resultFeetDiv.textContent = `${totalVolumeFeet.toFixed(2)} cubic Feet`;
});
