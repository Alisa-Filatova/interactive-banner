import gsap from 'gsap';

const gameTime = 15;
const fontSizeBase = 50;
const frameHeightBase = 810;

const root = document.querySelector('html');
const banner = document.querySelector('.banner');

const startScreen = document.querySelector('.start-screen');
const playButton = document.querySelector('.start-screen__button');
const game = document.querySelector('.game');
const timer = document.querySelector('.timer');
const finishScreen = document.querySelector('.finish-screen');

const fridgeBacterium = document.querySelector('.fridge__bacterium');
const ovenBacterium = document.querySelector('.oven__bacterium');
const plateBacterium = document.querySelector('.plate__bacterium');
const dishesBacterium = document.querySelector('.dishes__bacterium-box');
const switcherBacterium = document.querySelector('.switcher__bacterium');
const sinkBacterium = document.querySelector('.sink__bacterium-box');
const doorBacterium = document.querySelector('.door__bacterium');

const jumpingBacteriumTimeline = gsap.timeline();
const arrowIconTimeline = gsap.timeline();

const showElement = (element, duration = 0.5, delay = 0) => {
  gsap.to(element, {
    opacity: 1,
    duration: duration,
    delay: delay,
  });
};

const hideElement = (element, duration = 0.5) => {
  gsap.to(element, {
    opacity: 0,
    duration: duration,
    onComplete: () => {
      element.classList.add('hidden');
    },
  });
};

const setDataCleaned = (item) => {
  item.setAttribute('data-cleaned', true);
};

const getFoam = (bacterium) => {
  const item = bacterium.getAttribute('data-item');
  return document.querySelector(`.${item}__foam`);
};

const getDirt = (bacterium) => {
  const item = bacterium.getAttribute('data-item');
  return document.querySelector(`.dirt--${item}`);
};

const getItem = (bacterium) => {
  const item = bacterium.getAttribute('data-item');
  return document.querySelector(`.${item}`);
};

const resizeFont = () => {
  const size = (banner.offsetHeight * fontSizeBase) / frameHeightBase;

  root.style.fontSize = `${size}px`;
};

const bannerTextTween = (title, text, button) => {
  const timeline = gsap.timeline();

  timeline.from(title, {
    opacity: 0,
    duration: 2,
  });

  timeline.from(text, {
    opacity: 0,
    duration: 1.5,
  }, '-=1.2');

  timeline.from(button, {
    opacity: 0,
    scale: 1.1,
    duration: 1.5,
    ease: 'bounce.out',
  }, '-=1');
};

const jumpingBacteriumsTween = () => {
  jumpingBacteriumTimeline.to('.start-screen__bacterium--salad-green', {
    y: 20,
    duration: 1.5,
    repeat: -1,
    yoyo: true,
    ease: 'bounce.out',
  });

  jumpingBacteriumTimeline.to('.start-screen__bacterium--purple', {
    y: 30,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: 'bounce.out',
  }, '-=1');

  jumpingBacteriumTimeline.to('.start-screen__bacterium--brown', {
    y: 25,
    duration: 1,
    repeat: -1,
    yoyo: true,
    ease: 'bounce.out',
  }, '-=1.5');
};

const initStartScreenAnim = () => {
  jumpingBacteriumsTween();

  bannerTextTween(
    '.start-screen__title',
    '.start-screen__description',
    '.start-screen__button',
  );
};

const showOnboardingPopup = () => {
  const popupDescription = document.querySelector('.popup__description');

  showElement(fridgeBacterium);
  showElement(popupDescription);

  arrowIconTimeline.to('.popup__icon', {
    x: 20,
    repeat: -1,
    duration: 0.5,
    yoyo: true,
    delay: 0.5,
    ease: 'power.inOut',
  });
};

const showGameScreen = () => {
  showElement(game);

  gsap.to(game, {
    onComplete: () => {
      showOnboardingPopup();
    },
  });
};

const hideStartScreen = () => {
  hideElement(startScreen);
  jumpingBacteriumTimeline.pause();
};

const startOnboarding = () => {
  const timeline = gsap.timeline();
  const popup = document.querySelector('.popup');
  const onboardingScreen = document.querySelector('.onboarding');

  const foam = getFoam(fridgeBacterium);
  const dirt = getDirt(fridgeBacterium);
  const item = getItem(fridgeBacterium);

  timeline.to(popup, {
    opacity: 0,
    duration: 0.5,
    onComplete: () => {
      arrowIconTimeline.pause();
      fridgeBacterium.style.pointerEvents = 'none';
    }
  });

  timeline.to(foam, {
    opacity: 1,
    duration: 0.5,
  });

  timeline.to(foam, {
    y: '60%',
    duration: 2,
  });

  timeline.to(dirt, {
    opacity: 0,
    duration: 2,
  }, '-=2');

  timeline.to(foam, {
    opacity: 0,
    duration: 2,
    onComplete: () => {
      hideElement(onboardingScreen);
      startGame();
    },
  },'-=2');

  setDataCleaned(item);
};

const showKitchenBacteriums = () => {
  const kitchen = document.querySelector('.kitchen');
  kitchen.style.pointerEvents = 'auto';

  showElement(ovenBacterium);
  showElement(plateBacterium, 1.2, 0.2);
  showElement(dishesBacterium, 1, 0.3);
};

const runTimer = () => {
  const timeline = gsap.timeline();

  timeline.to(timer, {
    opacity: 1,
    duration: 0.5,
  });

  timeline.to('.timer-product', {
    opacity: 1,
    duration: 0.5,
  }, '-=0.5');

  timeline.to('.timer__bar', {
    x: '95%',
    duration: gameTime,
  });
};

const startGame = () => {
  const getCanvasSize = game.getBoundingClientRect();
  const canvasWidth = getCanvasSize.width;

  const getFrameSize = banner.getBoundingClientRect();
  const frameWidth = getFrameSize.width;

  const canvasEndPositionX = frameWidth - canvasWidth;

  showKitchenBacteriums();

  gsap.to(game, {
    x: canvasEndPositionX,
    duration: gameTime,
    delay: 1,
    ease: 'power.out',
    onComplete: () => {
      finishGame();
    },
  });

  runTimer();
};

const checkKitchenDirt = () => {
  const kitchen = document.querySelectorAll('.kitchen__item');

  const allClean = Array.from(kitchen).every((item) => (
    item.hasAttribute('data-cleaned')
    && item.getAttribute('data-cleaned') === 'true'
  ));

  if (allClean) {
    showSwitcherScreen();
  }
};

const showSwitcherScreen = () => {
  const switcherWallScreen = document.querySelector('.switcher-wall');
  switcherWallScreen.style.pointerEvents = 'auto';
  showElement(switcherWallScreen, 1, 1);
};

const showBathroomBacteriums = () => {
  const bathroom = document.querySelector('.bathroom');
  bathroom.style.pointerEvents = 'auto';

  showElement(sinkBacterium, 0.5, 1);
  showElement(doorBacterium, 0.5, 1.2);
};

const hideGameScreen = () => {
  hideElement(timer);
  hideElement('.timer-product');
  hideElement(game);
};

const checkResult = () => {
  const dirtyItems = document.querySelectorAll('[data-cleaned="false"]');

  if (dirtyItems.length === 0) {
    finishScreen.classList.add('finish-screen__text--win')
  }
};

const finishGame = () => {
  checkResult();
  hideGameScreen();
  showFinishScreen();
};

const showFinishScreen = () => {
  showElement(finishScreen, 1);

  bannerTextTween(
    '.finish-screen__title',
    '.finish-screen__description',
    '.finish-screen__button',
  );
};

playButton.addEventListener('click', (event) => {
  event.preventDefault();
  hideStartScreen();
  showGameScreen();
});

fridgeBacterium.addEventListener('click', () => {
  startOnboarding();
});

ovenBacterium.addEventListener('click', () => {
  const timeline = gsap.timeline();

  const item = getItem(ovenBacterium);
  const foam = getFoam(ovenBacterium);
  const dirt = getDirt(ovenBacterium);

  timeline.to(ovenBacterium, {
    opacity: 0,
    duration: 0.5,
  });

  timeline.to(foam, {
    opacity: 1,
    duration: 1,
  });

  timeline.to(foam, {
    y: '30%',
    duration: 1.5,
  });

  timeline.to(foam, {
    opacity: 0,
    duration: 2,
  }, '-=1');

  timeline.to(dirt, {
    opacity: 0,
    duration: 2,
    onComplete: () => dirt.style.display = 'none',
  }, '-=2');

  setDataCleaned(item);
  checkKitchenDirt();
});

plateBacterium.addEventListener('click', () => {
  const timeline = gsap.timeline();

  const foam = getFoam(plateBacterium);
  const dirt = getDirt(plateBacterium);
  const item = getItem(plateBacterium);

  timeline.to(plateBacterium, {
    opacity: 0,
    duration: 0.5,
  });

  timeline.to(foam, {
    opacity: 1,
    duration: 1,
  }, '-=0.5');

  timeline.to(foam, {
    opacity: 0,
    duration: 3,
  });

  timeline.to(dirt, {
    opacity: 0,
    duration: 3,
    onComplete: () => dirt.style.display = 'none',
  }, '-=3');

  setDataCleaned(item);
  checkKitchenDirt();
});

dishesBacterium.addEventListener('click', () => {
  const timeline = gsap.timeline();
  const dishesFoamPuddle = document.querySelector('.dishes__foam-puddle');

  const foam = getFoam(dishesBacterium);
  const dirt = getDirt(dishesBacterium);
  const item = getItem(dishesBacterium);

  timeline.to(dishesBacterium, {
    opacity: 0,
    duration: 0.5,
  });

  timeline.to(foam, {
    opacity: 1,
    duration: 1,
  },'-=0.5');

  timeline.to(dishesFoamPuddle, {
    opacity: 1,
    duration: 1,
  }, '-=1');

  timeline.to(foam, {
    opacity: 0,
    duration: 2,
  });

  timeline.to(dishesFoamPuddle, {
    y: '30%',
    duration: 2,
  }, '-=2');

  timeline.to(dishesFoamPuddle, {
    opacity: 0,
    duration: 2,
  }, '-=2');

  timeline.to(dirt, {
    opacity: 0,
    duration: 2,
    onComplete: () => dirt.style.display = 'none',
  }, '-=2');

  setDataCleaned(item);
  checkKitchenDirt();
});

switcherBacterium.addEventListener('click', () => {
  const timeline = gsap.timeline();

  const foam = getFoam(switcherBacterium);
  const dirt = getDirt(switcherBacterium);
  const item = getItem(switcherBacterium);

  timeline.to(switcherBacterium, {
    opacity: 0,
    duration: 0.5,
  });

  timeline.to(foam, {
    opacity: 1,
    duration: 0.5,
  });

  timeline.to(foam, {
    y: '100%',
    duration: 2,
  });

  timeline.to(foam, {
    opacity: 0,
    duration: 2,
  }, '-=2');

  timeline.to(dirt, {
    opacity: 0,
    duration: 2,
    onComplete: () => dirt.style.display = 'none',
  }, '-=2');

  setDataCleaned(item);

  if (item.getAttribute('data-cleaned') === 'true') {
    showBathroomBacteriums();
  }
});

sinkBacterium.addEventListener('click', () => {
  const timeline = gsap.timeline();

  const foam = getFoam(sinkBacterium);
  const dirt = getDirt(sinkBacterium);
  const item = getItem(sinkBacterium);

  timeline.to(sinkBacterium, {
    opacity: 0,
    duration: 0.5,
  });

  timeline.to(foam, {
    opacity: 1,
    duration: 1,
  }, '-=0.5');

  timeline.to(foam, {
    opacity: 0,
    duration: 2,
  });

  timeline.to(dirt, {
    opacity: 0,
    duration: 2,
    onComplete: () => dirt.style.display = 'none',
  }, '-=2');

  setDataCleaned(item);
});

doorBacterium.addEventListener('click', () => {
  const timeline = gsap.timeline();

  const foam = getFoam(doorBacterium);
  const dirt = getDirt(doorBacterium);
  const item = getItem(doorBacterium);

  timeline.to(doorBacterium, {
    opacity: 0,
    duration: 0.5,
  });

  timeline.to(foam, {
    opacity: 1,
    duration: 1,
  }, '-=0.4');

  timeline.to(foam, {
    y: '35%',
    duration: 1.5,
  });

  timeline.to(foam, {
    opacity: 0,
    duration: 1.5,
  }, '-=1');

  timeline.to(dirt, {
    opacity: 0,
    duration: 1.5,
    onComplete: () => dirt.style.display = 'none',
  }, '-=2');

  setDataCleaned(item);
});

window.addEventListener('resize', () => {
  resizeFont();
});

resizeFont();
initStartScreenAnim();
