const body = document.querySelector('body');
body.classList.add('background');

const playground = document.createElement('div');
playground.classList.add('playground');
body.appendChild(playground);

const restartButton = document.createElement('button');
restartButton.innerHTML = 'RES';
restartButton.classList.add('playground__restart-button');
playground.appendChild(restartButton);

const field = document.createElement('div');
field.classList.add('playground__field')
playground.appendChild(field);

const info = document.createElement('div');
info.classList.add('playground__info');
playground.appendChild(info);

const gamePlay = document.createElement('div');
gamePlay.classList.add('info__game-play');
gamePlay.innerHTML = 'На карте спрятано 10 бомб.\nНажимай правой кнопкой мыши чтобы пометить бомбы\n (На телефоне нужно зажать клетку пальцем)\nИгра выиграна если на карте верно помечено 10 бомб.'
info.appendChild(gamePlay);

const bombHeader = document.createElement('div');
bombHeader.classList.add('info__bomb-header');
bombHeader.innerHTML = 'Количество оставшихся флагов:';
info.appendChild(bombHeader);

const bombCounter = document.createElement('div');
bombCounter.classList.add('info__bomb-counter');
bombCounter.innerHTML = '10';
info.appendChild(bombCounter);

const fieldCell = {
    isBomb: false
};

const matrix = [];

for (let i = 0; i < 10; i++) {
    matrix[i] = [];
}

for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
        matrix[i][j] = { ...fieldCell };
    }
}

let bombsCount = 0;

while (bombsCount < 10) {
    const randomRow = Math.floor(Math.random() * 10);
    const randomCol = Math.floor(Math.random() * 10);

    if (!matrix[randomRow][randomCol].isBomb) {
        matrix[randomRow][randomCol].isBomb = true;
        bombsCount++;
    }
}

for (let i = 0; i < 10; i++) {
    const cellRow = document.createElement('div');
    cellRow.classList.add('field__cell-row');
    field.appendChild(cellRow);

    for (let j = 0; j < 10; j++) {
      const cell = document.createElement('div');
      cell.classList.add('cell-row__cell');
      cell.id = `cell-${i}-${j}`;
      cellRow.appendChild(cell);

      if (matrix[i][j].isBomb) {
        cell.classList.add('bomb');
      } else {
        cell.addEventListener('click', createClickHandler(cell, i, j));
      }
    }
}

function createClickHandler(cell, row, col) {
  return function() {
    if (cell.classList.contains('cleared')) {
      return;
    }

    if (matrix[row][col].isBomb) {
      console.log('Игра проиграна!');
    } else {
      clearAdjacentCells(row, col);
    }
  }
}

function clearAdjacentCells(row, col) {
  const cell = document.getElementById(`cell-${row}-${col}`);
  if (!cell || cell.classList.contains('cleared')) {
    return;
  }

  cell.classList.add('cleared');

  let count = 0;
  for (let i = row - 1; i <= row + 1; i++) {
    for (let j = col - 1; j <= col + 1; j++) {
      if (i >= 0 && i < 10 && j >= 0 && j < 10 && matrix[i][j].isBomb) {
        count++;
      }
    }
  }

  if (count > 0) {
    cell.textContent = count;
  } else {
    for (let i = row - 1; i <= row + 1; i++) {
      for (let j = col - 1; j <= col + 1; j++) {
        clearAdjacentCells(i, j);
      }
    }
  }
}

playground.addEventListener('click',(event) => {
    if(event.target.classList.contains('bomb')) {
        const bombs = document.querySelectorAll('.bomb');

        for (let i = 0; i < bombs.length; i++) {
          //bombs[i].innerHTML = 'BOOM'
          bombs[i].classList.add('bomb-exploded')
        }

        setTimeout(() => {
          field.remove();
          info.remove();
          const h1 = document.createElement('h1');
          h1.innerHTML = 'Потрачено. Тебя взорвали! Давай еще похулиганим!';
          playground.appendChild(h1);

          const img = document.createElement('img');
          img.src = 'bang.jpg';
          img.alt = 'ggg';
          playground.appendChild(img);
        }, 1800);
    }
})

restartButton.addEventListener('click', () => {
    location.reload();
})

let flagCounter = 10;

playground.addEventListener('contextmenu', (event) => {
  event.preventDefault();
  if (event.target.classList.contains('cell-row__cell')) {
    if (flagCounter > 0 && !event.target.classList.contains('bomb-marked')) {
      event.target.classList.add('bomb-marked');
      flagCounter -= 1;
      bombCounter.innerHTML = flagCounter;
    } else if (event.target.classList.contains('bomb-marked')) {
      event.target.classList.remove('bomb-marked');
      flagCounter += 1;
      bombCounter.innerHTML = flagCounter;
    }
  }

  let checkFlags = document.querySelectorAll('.bomb-marked');
  let checked = 0;
  checkFlags.forEach(element => {
    if(element.classList.contains('bomb')){
      checked += 1;
    }
  });

  if(checked === 10) {
    field.remove();
    gamePlay.innerHTML = 'Вы выиграли, все бомбы найдены!';
  }
});






