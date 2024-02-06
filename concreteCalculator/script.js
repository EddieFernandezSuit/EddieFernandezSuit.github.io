
let wallCount = 1;
const wallContainer = document.getElementById('wall-container');
const addWallButton = document.getElementById('add-wall');
const calculateButton = document.getElementById('calculate');
const resultDiv = document.getElementById('result');

addWallButton.addEventListener('click', () => {
    wallCount++;
    const newWall = document.createElement('div');
    newWall.innerHTML = `
        <h2>Wall ${wallCount}</h2>
        <label for="length${wallCount}">Length:</label>
        <input type="number" id="length${wallCount}">

        <label for="width${wallCount}">Width:</label>
        <input type="number" id="width${wallCount}">

        <label for="height${wallCount}">Height:</label>
        <input type="number" id="height${wallCount}">
    `;
    wallContainer.appendChild(newWall);
});

// calculateButton.addEventListener('click', () => {
//     let totalVolume = 0;

//     for (let i = 1; i <= wallCount; i++) {
//         const length = parseFloat(document.getElementById(`length${i}`).value);
//         const width = parseFloat(document.getElementById(`width${i}`).value);
//         const height = parseFloat(document.getElementById(`height${i}`).value);

//         const prevIndex = (i === 1) ? wallCount : i - 1;
//         const prevWidth = parseFloat(document.getElementById(`width${prevIndex}`).value);

//         totalVolume += (length - prevWidth) * width * height;
//     }

//     resultDiv.textContent = `Total Volume: ${totalVolume.toFixed(2)} cubic units`;
// });

calculateButton.addEventListener('click', () => {
    const walls = []; // Array to store wall data

    for (let i = 1; i <= wallCount; i++) {
        const length = parseFloat(document.getElementById(`length${i}`).value);
        const width = parseFloat(document.getElementById(`width${i}`).value);
        const height = parseFloat(document.getElementById(`height${i}`).value);

        walls.push({ length: length, width: width, height: height });
    }

    const totalVolume = calculateVolume(walls);
    resultDiv.textContent = `Total Volume: ${totalVolume.toFixed(2)} cubic units`;
});

function calculateVolume(walls) {
    let totalVolume = 0;
    for (let i = 0; i < walls.length; i++) {
        const prevWallIndex = (i - 1 + walls.length) % walls.length; // Wrap around for the last wall
        totalVolume += (walls[i].length - walls[prevWallIndex].width) * 
                       walls[i].width * walls[i].height;
    }
    return totalVolume;
}