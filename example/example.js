const ca = new ConvergenceColorAssigner.ColorAssigner();

const colorList = document.getElementById('colors');
let nextId = 0;

function addColor() {
  const id = nextId++;
  const color = ca.getColorAsHex(id);

  const li = document.createElement('li');
  li.className = 'color-item';
  li.style.background = color;

  const span = document.createElement('span');
  span.innerHTML = color;
  li.appendChild(span);

  const removeButton = document.createElement('button');
  removeButton.innerHTML = "Remove Color";
  removeButton.className = "remove-button";

  removeButton.onclick = function () {
    ca.releaseColor(id);
    colorList.removeChild(li);
  };
  li.appendChild(removeButton);

  colorList.appendChild(li);
}

for (let i = 0; i < ca.palette().length; i++) {
  addColor();
}

function roundArray(array, decimalPoints) {
  // console.log(array);
  return array.map(function (v) {
    return Math.round(v * (10 * decimalPoints)) / (10 * decimalPoints);
  });
}
