const container = document.querySelector(".container");
const content = document.querySelector(".banner");

// const resizeContent = () => {
//   // info.style.fontSize = (content.offsetHeight * 50 ) / 810 + "px";
//   game.style.width = 
//   content.style.width = content.offsetWidth + "px";
//   content.style.height = content.offsetHeight + "px";
// }

// // resizeContent();

// let timeoutId;

// window.addEventListener('resize', () => {
//   clearTimeout(timeoutId);
//   timeoutId = setTimeout(resizeContent, 100);
// });


const setDataCleaned = (item) => {
  item.setAttribute('data-cleaned', true);
};

const hideElement = (element, duration = 0.5) => {
  gsap.to(element, {
    opacity: 0, 
    duration: duration, 
    onComplete: () => {
      if (!element.classList.contains('hidden')) {
        element.classList.add('hidden');
      }
    }
  });
};

const showElement = (element, duration = 0.5, delay = 0) => {
  gsap.to(element, {
    onStart: () => {
      if (element.classList.contains('hidden')) {
        element.classList.remove('hidden');
      }
    },
    opacity: 1, 
    duration: duration,
    delay: delay,
  });
};

const bannerTextTween = (title, text, button) => {
  const textTimeline = gsap.timeline();
 
  textTimeline.from(title, { 
    opacity: 0,
    duration: 2,
  });
  
  textTimeline.from(text, { 
    opacity: 0,
    duration: 1.5,
  }, '-=1.2');
  
  textTimeline.from(button, { 
    opacity: 0,
    scale: 1.1,
    duration: 1.5,
    ease: 'bounce.out',
  }, '-=1.5');
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

const jumpingBacteriumsTween = () => {
  const bacteriumTimeline = gsap.timeline();

  bacteriumTimeline.to('.start-screen__bacterium', {
    stagger: 0.25,
    y: 30,
    repeat: -1,
    yoyo: true,
    duration: 2,
    ease: 'bounce.out',
  });
  
  bacteriumTimeline.to('.start-screen__bacterium--brown', { 
    y: 25,
    duration: 1,
  }, '+=1');
  
  bacteriumTimeline.to('.start-screen__bacterium--salad-green', { 
    y: 20,
    duration: 1.5,
  }, '+=1.5');
};

const initStartScreenAnim = () => {
  jumpingBacteriumsTween();
  bannerTextTween(
    '.start-screen__title',
    '.start-screen__description',
    '.start-screen__button'
  );
};

initStartScreenAnim();

const canvasWidth = 2503;
const frameWidth = 1080;
const gameTime = 15;

const startScreen = document.querySelector('.start-screen');
const onboardingScreen = document.querySelector('.onboarding');
const kitchenScreen = document.querySelector('.kitchen');
const switcherWallScreen = document.querySelector('.switcher-wall');
const bathroomScreen = document.querySelector('.bathroom');
const finishScreen = document.querySelector('.finish-screen');

const fridgeBacterium = document.querySelector('.fridge__bacterium');
const ovenBacterium = document.querySelector('.oven__bacterium');
const plateBacterium = document.querySelector('.plate__bacterium');
const dishesBacterium = document.querySelector('.dishes__bacterium');
const switcherBacterium = document.querySelector('.switcher__bacterium');
const sinkBacterium = document.querySelector('.sink__bacterium');
const doorBacterium = document.querySelector('.door__bacterium');

const showOnboardingPopup = () => {
  const popupDescription = document.querySelector('.popup__description');
  showElement(fridgeBacterium);
  showElement(popupDescription);

  gsap.to('.popup__icon', { 
    x: 20,
    repeat: -1,
    duration: 0.5,
    yoyo: true,
    delay: 0.5,
    ease: 'in',
  });      
};

const game = document.querySelector('.game');

const showGameScreen = () => {
  showElement(game);

  gsap.to(game, {
    onComplete: () => {
      showOnboardingPopup();
    }
  });
};

const hideStartScreen = () => {
  hideElement(startScreen);
};

const playButton = document.querySelector('.start-screen__button');

playButton.addEventListener('click', (event) => {
  event.preventDefault();
  hideStartScreen();
  showGameScreen();
});

const checkResult = () => {
  const dirtyItems = document.querySelectorAll('[data-cleaned="false"]');

  if (dirtyItems.length === 0) {
    finishScreen.classList.add('finish-screen__text--win')
  }
};

const showFinishScreen = () => {
  showElement(finishScreen, 1);
  bannerTextTween('.finish-screen__title', '.finish-screen__description', '.finish-screen__button');
};

const timer = document.querySelector('.timer');
const timerBar = document.querySelector('.timer__bar');

const runTimer = () => {
  const timerTimeline = gsap.timeline();

  timerTimeline.to(timer, {
    opacity: 1, 
    duration: 0.5,
  });

  timerTimeline.to(timerBar, {
    width: '3%', 
    duration: gameTime,
  });

  timerTimeline.to(timerBar, {
    backgroundColor: 'var(--color-red-light)', 
    duration: 5,
  }, '-=10');
};

const finishGame = () => {
  checkResult();
  hideGameScreen();
  showFinishScreen();
};

const startGame = () => {
  const canvasEndPositionX = -(canvasWidth - frameWidth);

  showElement(kitchenScreen);

  gsap.to(game, {
    x: canvasEndPositionX, 
    duration: gameTime, 
    delay: 1, 
    ease: 'power.out',
    onComplete: () => {
      finishGame();
    }
  });

  runTimer();
};

const startOnboarding = () => {
  const timeline = gsap.timeline();
  const foam = getFoam(fridgeBacterium);
  const dirt = getDirt(fridgeBacterium);
  const item = getItem(fridgeBacterium);

  timeline.to('.popup', {
    opacity: 0, 
    duration: 0.5,
  });
  timeline.to(foam, {
    opacity: 1, 
    duration: 0.5,
  });
  timeline.to(foam, {
    y: 410, 
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

fridgeBacterium.addEventListener('click', () => {
  startOnboarding();
});

const showSwitcherScreen = () => {
  showElement(switcherWallScreen, 1, 1);
};

const hideGameScreen = () => {
  hideElement(timer);
  hideElement(game);
};

const checkKitchenDirt = () => {
  const kitchen = document.querySelectorAll('.kitchen__item');

  const allClean = Array.from(kitchen).every((item) => (
    item.hasAttribute('data-cleaned')
    && item.getAttribute('data-cleaned') === 'true'
  ));

  if (allClean) {
    showSwitcherScreen(switcherWallScreen);
  }
};

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
    y: 410, 
    duration: 3,
  });
  timeline.to(foam, {
    opacity: 0, 
    duration: 3
  }, '-=2');
  timeline.to(dirt, {
    opacity: 0, 
    duration: 3
  }, '-=3');
  timeline.to(dirt, {
    display: 'none',
  });

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
  }, '-=3');
  timeline.to(dirt, {
    display: 'none',
  });

  setDataCleaned(item);
  checkKitchenDirt();
});

dishesBacterium.addEventListener('click', () => {
  const timeline = gsap.timeline();
  // TODO
  const dishesFoam2 = document.querySelector('.dishes__foam-box');
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
  });
  timeline.to(foam, {
    opacity: 0, 
    duration: 3,
  });
  timeline.to(dishesFoam2, {
    opacity: 1, 
    duration: 1
  },'-=2');
  timeline.to(dishesFoam2, {
    y: 310, 
    duration: 2
  }, '-=1');
  timeline.to(dirt, {
    opacity: 0, 
    duration: 3
  }, '-=3');
  timeline.to(dirt, {
    display: 'none',
  });

  setDataCleaned(item);
  checkKitchenDirt();
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
  }, '-=0.4');
  timeline.to(foam, {
    opacity: 0, 
    duration: 3,
  });
  timeline.to(dirt, {
    opacity: 0, 
    duration: 3,
  }, '-=3')
  timeline.to(dirt, {
    display: 'none',
  });

  setDataCleaned(item);
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
    y: 310, 
    duration: 2,
  });
  timeline.to(foam, {
    opacity: 0, 
    duration: 2
  }, '-=1');
  timeline.to(dirt, {
    opacity: 0, 
    duration: 3
  }, '-=3');
  timeline.to(dirt, {
    display: 'none',
  });

  setDataCleaned(item);

  if (item.getAttribute('data-cleaned') === 'true') {
    showElement(bathroomScreen, 0.5, 1);
  }
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
    y: 210, 
    duration: 2,
  });
  timeline.to(foam, {
    opacity: 0, 
    duration: 2,
  }, '-=1');
  timeline.to(dirt, {
    opacity: 0, 
    duration: 2,
  }, '-=3');
  timeline.to(dirt, {
    display: 'none',
  });

  setDataCleaned(item);
});
