document.getElementById('jesse-plus-button').addEventListener('click', function() {
    document.getElementById('jesse-circles').innerHTML = document.getElementById('jesse-circles').innerHTML * 1 + 1;
});

document.getElementById('jesse-minus-button').addEventListener('click', function() {
    document.getElementById('jesse-circles').innerHTML = document.getElementById('jesse-circles').innerHTML * 1 - 1;
});

document.getElementById('azari-plus-button').addEventListener('click', function() {
    document.getElementById('azari-circles').innerHTML = document.getElementById('azari-circles').innerHTML * 1 + 1;
});

document.getElementById('azari-minus-button').addEventListener('click', function() {
    document.getElementById('azari-circles').innerHTML = document.getElementById('azari-circles').innerHTML * 1 - 1;
});