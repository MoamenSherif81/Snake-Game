const fruit = document.querySelector('.fruit');
const snakeContainer = document.querySelector('.container');

function generateFruit(){a
  fruit.style.top = Math.floor(Math.random() * (snakeContainer.scrollHeight - 20)) + 'px';
  fruit.style.left = Math.floor(Math.random() * (snakeContainer.scrollWidth - 20)) + 'px';
}

generateFruit();