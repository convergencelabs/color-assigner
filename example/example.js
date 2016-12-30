var ca = new ColorAssigner();

var colorList = document.getElementById('colors');
var nextId = 0;

function addColor() {
  var id = nextId++;
  var color = ca.getColorAsHex(id);

  var li = document.createElement('li');
  li.className = 'color-item';
  li.style.background = color;

  var span = document.createElement('span');
  span.innerHTML = color;
  li.appendChild(span);

  var removeButton = document.createElement('button');
  removeButton.innerHTML = "Remove Color";
  removeButton.className = "remove-button";

  removeButton.onclick = function () {
    ca.releaseColor(id);
    colorList.removeChild(li);
  };
  li.appendChild(removeButton);

  colorList.appendChild(li);
}

for (var i = 0; i < ca.palette().length; i++) {
  addColor();
}

function roundArray(array, decimalPoints) {
  // console.log(array);
  return array.map(function (v) {
    return Math.round(v * (10 * decimalPoints)) / (10 * decimalPoints);
  });
}
