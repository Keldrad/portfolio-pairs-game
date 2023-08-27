(function () {
  // создание модального окна
  function createModal() {
    // обертка модального окна
    const modalWrapper = document.createElement('div');

    // заголовок модального окна
    const modalHeader = document.createElement('h2');
    modalHeader.textContent = 'Выберите размер поля';

    // подзаголовок модального окна
    const modalTip = document.createElement('h4');
    modalTip.textContent = '* четное число, от 2 до 10 для каждой оси.';

    // поле ввода Х
    const modalInputsWrapper = document.createElement('div');
    const modalInputXWrapper = document.createElement('div');
    const modalInputX = document.createElement('input');
    modalInputX.classList.add('js-test-input-x');
    modalInputX.value = 4;
    modalInputX.type = 'number';
    modalInputX.step = 2;
    modalInputX.min = 2;
    modalInputX.max = 10;
    // подсказка по Х
    const modalInputXTip = document.createElement('span');
    modalInputXTip.textContent = 'Число карточек по горизионтали';

    // поле ввода Y
    const modalInputYWrapper = document.createElement('div');
    const modalInputY = document.createElement('input');
    modalInputY.classList.add('js-test-input-y');
    modalInputY.value = 4;
    modalInputY.type = 'number';
    modalInputY.step = 2;
    modalInputY.min = 2;
    modalInputY.max = 10;
    // подсказка по Y
    const modalInputYTip = document.createElement('span');
    modalInputYTip.textContent = 'Число карточек по вертикали';

    // Кнопка "Начать"
    const modalButton = document.createElement('button');
    modalButton.textContent = 'Начать';

    // стили элементов
    modalWrapper.classList.add('modal-wrapper');
    modalHeader.classList.add('modal-header');
    modalTip.classList.add('modal-tip');
    modalInputsWrapper.classList.add('modal-inputs-wrapper');
    modalInputXWrapper.classList.add('modal-input-wrapper');
    modalInputX.classList.add('modal-input');
    modalInputXTip.classList.add('modal-input-tip');
    modalInputYWrapper.classList.add('modal-input-wrapper');
    modalInputY.classList.add('modal-input');
    modalInputYTip.classList.add('modal-input-tip');
    modalButton.classList.add('btn-reset', 'button');

    // компановка элементов
    modalWrapper.append(modalHeader);
    modalWrapper.append(modalTip);

    modalInputsWrapper.append(modalInputXWrapper);
    modalInputsWrapper.append(modalInputYWrapper);
    modalInputXWrapper.append(modalInputXTip);
    modalInputXWrapper.append(modalInputX);
    modalInputYWrapper.append(modalInputYTip);
    modalInputYWrapper.append(modalInputY);

    modalWrapper.append(modalInputsWrapper);
    modalWrapper.append(modalButton);

    // событие при клике по кнопке
    modalButton.addEventListener('click', checkModalInput);

    return {
      modalWrapper,
      modalInputX,
      modalInputY,
      modalButton,
    };
  }

  // инициализация модального окна
  const body = document.getElementById('body');
  const modal = createModal();
  body.append(modal.modalWrapper);

  // проверка значений в полях ввода
  function checkModalInput() {
    if (
      modal.modalInputX.value % 2 !== 0 ||
      modal.modalInputY.value % 2 !== 0
    ) {
      alert('Введено не четное значение!');
      modal.modalInputX.value = 4;
      modal.modalInputY.value = 4;
    } else if (
      modal.modalInputX.value < 2 ||
      modal.modalInputY.value < 2 ||
      modal.modalInputX.value > 10 ||
      modal.modalInputY.value > 10
    ) {
      alert('Введено число не в диапазоне от 2 до 10!');
      modal.modalInputX.value = 4;
      modal.modalInputY.value = 4;
    } else {
      modal.modalWrapper.classList.add('hidden');
      setTimeout(() => modal.modalWrapper.remove(), 400);
      setTimeout(() => {
        game = createPairsGame();
        container.append(game.gameWrapper);
        container.classList.remove('hidden');
      }, 500);
    }
  }

  // инициализация игрового поля
  const container = document.getElementById('pairs-app');

  // создание игрового поля
  function createPairsGame() {
    const gameWrapper = document.createElement('div');
    const timerWrapper = document.createElement('div');
    const timerHeader = document.createElement('h2');
    timerHeader.textContent = 'ТАЙМЕР:';
    const timerCounter = document.createElement('div');
    timerCounter.textContent = 60;
    const field = document.createElement('div');
    field.setAttribute(
      'style',
      `grid-template-columns: repeat(${modal.modalInputX.value}, max-content)`
    );

    const againButton = document.createElement('button');
    againButton.textContent = 'Сыграть еще раз';

    // стили элементов
    gameWrapper.classList.add('game-wrapper');
    timerWrapper.classList.add('timer-wrapper');
    timerHeader.classList.add('timer-header');
    timerCounter.classList.add('timer-counter');
    field.classList.add('field');
    againButton.classList.add('btn-reset', 'button', 'btn-hidden');

    // компановка элементов
    timerWrapper.append(timerHeader);
    timerWrapper.append(timerCounter);
    gameWrapper.append(timerWrapper);
    gameWrapper.append(field);
    gameWrapper.append(againButton);

    // получение значений размеров поля из модального окна
    const x = modal.modalInputX.value;
    const y = modal.modalInputY.value;

    // создание массива значений карточек для игры
    const GAME_ARR = [];
    for (let i = 1; i <= (x * y) / 2; i++) {
      GAME_ARR.push(i);
      GAME_ARR.push(i);
    }

    // Тасование Фишера — Йетса
    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    shuffle(GAME_ARR);

    // создание карточек и размещение их в field
    let fieldCard;
    for (let i = 0; i < GAME_ARR.length; i++) {
      fieldCard = document.createElement('div');
      fieldCard.classList.add('field-card');
      fieldCard.textContent = GAME_ARR[i];
      fieldCard.addEventListener('click', fieldCardClick);
      field.appendChild(fieldCard);
    }

    // таймер
    function timerStart() {
      timer = setInterval(() => {
        // остановка таймера если найдены все пары
        if (pairCounter === game.GAME_ARR.length / 2) {
          clearInterval(timer);
        }

        // мигание истекающего таймера
        timerCounter.textContent--;
        if (timerCounter.textContent <= 10 && timerCounter.textContent > 0) {
          timerCounter.removeAttribute('style');
          setTimeout(() => {
            timerCounter.setAttribute('style', 'color: red');
          }, 400);
          setTimeout(() => {
            timerCounter.removeAttribute('style');
          }, 500);
        }

        // Lose
        if (timerCounter.textContent === '0') {
          setTimeout(() => {
            timerCounter.setAttribute('style', 'color: red');
          }, 200);
          clearInterval(timer);
          field.classList.add('field_lose');
          pairCounter = 0;
          const cards = document.querySelectorAll('.field-card');
          cards.forEach((card) => {
            card.classList.add('untouchable');
          });
          setTimeout(() => {
            game.againButton.classList.remove('btn-hidden');
          }, 500);
        }
      }, 1000);
    }

    // старт таймера с поправкой на реакцию человека
    setTimeout(() => {
      timerStart();
    }, 300);

    // клик по кнопке "Сыграть еще раз"
    againButton.addEventListener('click', () => {
      container.classList.add('hidden');
      setTimeout(() => gameWrapper.remove(), 200);
      // modal = createModal();
      body.append(modal.modalWrapper);
      modal.modalWrapper.classList.add('hidden');
      setTimeout(() => modal.modalWrapper.classList.remove('hidden'), 300);
    });

    return {
      gameWrapper,
      timerCounter,
      field,
      fieldCard,
      againButton,
      GAME_ARR,
    };
  }

  // клик по карточке
  let firstCard = 0;
  let secondCard = 0;
  let pairCounter = 0;

  function fieldCardClick() {
    this.classList.add('field-card_open');
    if (firstCard === 0) {
      firstCard = this;
    } else {
      secondCard = this;
      if (firstCard.textContent === secondCard.textContent) {
        firstCard = 0;
        secondCard = 0;
        ++pairCounter;
        // Win
        if (pairCounter === game.GAME_ARR.length / 2) {
          clearInterval(timer);
          pairCounter = 0;
          game.field.classList.add('field_win');
          game.timerCounter.classList.add('timer-counter_win');
          setTimeout(() => {
            game.againButton.classList.remove('btn-hidden');
          }, 500);
        }
      } else {
        const cards = document.querySelectorAll('.field-card');
        cards.forEach((card) => {
          card.classList.add('untouchable');
        });
        setTimeout(() => {
          firstCard.classList.remove('field-card_open');
          secondCard.classList.remove('field-card_open');
          firstCard = 0;
          secondCard = 0;
          cards.forEach((card) => {
            card.classList.remove('untouchable');
          });
        }, 300);
      }
    }
  }
})();
