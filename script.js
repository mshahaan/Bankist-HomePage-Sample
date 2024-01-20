'use strict';

///////////////////////////////////////
// Modal window

const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const logo = document.querySelector('.nav__logo');

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

let currentSlide = 0;
const maxSlide = slides.length;

const openModal = function (e) {
  e.preventDefault();

  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

function navHover(event){

  const opacity = this;

  // We don't need to use closest since the links don't have child elements
  if(event.target.classList.contains('nav__link')){

    const link = event.target;

    const siblings = link.closest('nav').querySelectorAll('.nav__link');

    const logo = link.closest('nav').querySelector('img');

    siblings.forEach(function(element) {

      if(element !== link) element.style.opacity = opacity;

      logo.style.opacity = opacity;

    });

  }

}

function goToSlide(displayedSlide) {

  slides.forEach(function(slide, index) {

    slide.style.transform = `translateX(${100 * (index - displayedSlide)}%)`;
  
  });

}

function createDots() {

  slides.forEach(function(_, index) {

    dotContainer.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide="${index}"></button>`);

  });

}

function activateDot(displayedSlide) {

  document.querySelectorAll('.dots__dot').forEach(function(dot) {

    dot.classList.remove('dots__dot--active');

  });

  document.querySelector(`.dots__dot[data-slide="${displayedSlide}"]`).classList.add('dots__dot--active');

}

function init() {

  goToSlide(0);

  createDots();

  activateDot(0);

}

init();

btnsOpenModal.forEach(function(btn){
  btn.addEventListener('click', openModal);
})

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Sticky navigation

const navHeight = nav.getBoundingClientRect().height;

function stickyNav(entries, observer){

  const [entry] = entries;

  if(!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');

}

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// When we create the IntersectionObserver, we pass in a callback function and an object with two
// properties. The object will have the properties root which will define the viewport, use null 
// for the user viewport, and threshold  which will define how much of the desired section must be
// shown as a percentage before the callback function is called. We attach an element to the 
// observer by doing observer.observe(element). Below we have the observer attached to section 1.
// So when we scroll to a point where 10 percent (0.1) or more of section 1 is visible in the
// viewport then the callback function is called. the callback function is passed an array entries
// of the thresholds defined in the object which there can be multiple and the observer itself.
// Above we will use this to implement the Sticky nav bar.

/**

function observerCallback(entries, observer){

  

}

const observerOptions = {
  root : null,
  threshold : 0.1
};

const observer = new IntersectionObserver(observerCallback, observerOptions);
observer.observe(section1);

*/

// This is the outdated way to do this
// the scroll event fires off on any scroll no matter how small so performance will suffer
// The workaround is to use the Intersection Observer API (Above)

/**

const initialCoords = section1.getBoundingClientRect();

window.addEventListener('scroll', function (e) {

  if(window.scrollY > initialCoords.top) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
  
});

*/

// Reavealing Sections and Images on Scroll

// We will use the Intersection Observer API to implement this

// Sections

function revealSection(entries, observer){

  const [entry] = entries;

  if(entry.isIntersecting){ 

    entry.target.classList.remove('section--hidden'); 

    sectionObserver.unobserve(entry.target);
  }

}

const allSections = document.querySelectorAll('.section');

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function(section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// Images

// Selecting all images with attribute data-src
const imgTargets = document.querySelectorAll('img[data-src]');

function loadImage(entries, observer){

  const [entry] = entries;

  if(!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  // Simply doing this will unblur before the image loads on slower browsers
  // entry.target.classList.remove('lazy-img');

  // It is better practice to unblur when loading is complete
  // Luckily there is a load event we can use to our advantage
  entry.target.addEventListener('load', () => entry.target.classList.remove('lazy-img'));

  // observer.unobserve(entry);

}

const imgObserver = new IntersectionObserver(loadImage, {
  root: null,
  threshold: 0,

  // We will enter this here so the user is unaware of the loading process
  rootMargin: '200px',
});

imgTargets.forEach(function(img) {

  imgObserver.observe(img);

});

// Menu fade animation

// mouseover is just like mouseenter except mouseover bubbles unlike mouseenter

/**
 * We created the handler function above but cannot pass args into it when we pass it in 
 * as a callback function. We could simply pass in the following function
 * 
 * function(e) { navHover(e, 0.5); }
 * 
 * or we could use bind to make a copy of the function and pass in our arg/args as the arg for bind.
 * The args for bind set the this keyword in the handler function so to access the opacity we want
 * we use this in navHover. For multiple args we can send in an array.
 */

nav.addEventListener('mouseover', navHover.bind(0.5));

nav.addEventListener('mouseout', navHover.bind(1));

// Implementing Tabbed Component

tabsContainer.addEventListener('click', function(e) {

  // We use closest since if we click on the text within the button, which is contained
  // in a span element, the target will be the span element and not the button
  const clicked = e.target.closest('.operations__tab');

  // If the tab container was clicked then clicked will be null and everything below
  // will produce an error. We do not want to do anything when clicked is not a button
  // so we return from the function here. An if statement with just a return statement
  // in it is called a Guard Clause.
  if(!clicked) return;

  // removing active tab styling from all tabs
  tabs.forEach(function(tab) {
    tab.classList.remove('operations__tab--active');
  });

  // removing active content styling from each content pane
  tabsContent.forEach(function(content) {
    content.classList.remove('operations__content--active');
  });

  // adding active tab styling to selected tab
  clicked.classList.add('operations__tab--active');
  
  // adding active content styling to selected tab's content
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');

});

// Slider Component

// slider.style.transform = 'scale(0.5)';
// slider.style.overflow = 'visible';

function nextSlide() {

  if(currentSlide === maxSlide-1) currentSlide = 0;
  else currentSlide++;

  goToSlide(currentSlide);
  activateDot(currentSlide);

}

function prevSlide() {

  if(currentSlide === 0) currentSlide = maxSlide-1;
  else currentSlide--;

  goToSlide(currentSlide);
  activateDot(currentSlide);

}

btnRight.addEventListener('click', nextSlide);

btnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', function(e) {

  if (e.key === 'ArrowLeft') prevSlide();
  if (e.key === 'ArrowRight') nextSlide();

});

dotContainer.addEventListener('click', function(e) {

  if(e.target.classList.contains('dots__dot')) {

    goToSlide(e.target.dataset.slide);

    activateDot(e.target.dataset.slide);

  }

});

// Implementing Smooth Scrolling

btnScrollTo.addEventListener('click', function(){ section1.scrollIntoView({ behavior: 'smooth' }); });

// Using Event Delegation to apply smooth scrolling to nav bar links

// Steps:

// 1. Add event listener to common parent element
// 2. Determine what element the event originated from

document.querySelector('.nav__links').addEventListener('click', function(e) {

  e.preventDefault();

  // Check if the click originated from ob=ne of the links
  if(e.target.classList.contains('nav__link')){
    const id = e.target.getAttribute('href');

    document.querySelector(id).scrollIntoView({ behavior:'smooth' });

  }

});

logo.addEventListener('click', function(e) {
  e.preventDefault();

  header.scrollIntoView({ behavior: 'smooth' });
});




/**
 * Event Delegation
 * 
 * The below code puts an event on each link in the nav bar meaning it is creating an identical
 * event listener with the same function for each link. This is not optimal. We use event delegation 
 * to handle that. We use a parent element to figure out which child element the event originated
 * from and then handle it in the parent function. We can do this using the event.target property.
 * 
 * Above you can find an example of doing the below code but using event delegation.
 */

/**
document.querySelectorAll('.nav__link').forEach(function(element) {

  element.addEventListener('click', function(e) {

    // The html code has these events moving to the desired section without smooth scrolling
    // This prevents that
    e.preventDefault();

    const id = this.getAttribute('href');

    document.querySelector(id).scrollIntoView({ behavior:'smooth' });
    
  });

});
*/

/** 
 
btnScrollTo.addEventListener('click', function(e) {
  // coordinates of section to scroll to
  const s1coords = section1.getBoundingClientRect();

  // Scrolls to desired area by defining left coordinate and top coordinate
  // window.scrollTo(s1coords.left + window.pageXOffset, s1coords.top + window.pageYOffset);

  // Doing the above but with an object
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,

  //   // This differentiates this method
  //   // We can implement smooth scrolling through this property
  //   behavior: 'smooth'
  // });

  // Modern method of doing the above is much simpler
  // We take the element to scroll to, call the following method, and define the behavior in
  // a passed in object
  section1.scrollIntoView({
    behavior: 'smooth'
  });

  // The last method is only available in modern browsers
});

*/






///////////////////////////////////////////////////////////////////////////////////////////////////

// SELECTING, CREATING, AND DELETING ELEMENTS

/**
 * Selecting elements
 * 
 * document.documentElement selects the entire html page so you can apply styling to it
 * 
 * document.head and document.body select the head and body respectively
 * 
 * document.querySelector('.class') selects the first element with the specified class or id
 * 
 * document.querySelectorAll('.class') returns a nodelist of all elements of the specified class
 * 
 * document.getElementByID('id') returns the element of a certain id
 * 
 * document.getElementsByTagName('htmlTag') returns all elements of a certain tag, for example h1
 * returns an HTMLCollection which is a live collection that updates as the page updates, so if an 
 * element of a tag is deleted, it is also deleted from the list returned by the function
 * 
 * document.getElementsByClassName('class') returns a live HTMLCollection of all elements of a 
 * certain class
 */

// Inserting Elements

// We have used insertAdjacentHTML()

// Creates a div tag and saves it in the message var
// Still needs to be inserted into the DOM
const message = document.createElement('div');

// Adding class to newly created div tag
message.classList.add('cookie-message');

// Manually setting text content
// message.textContent = 'We use cookies for improved functionality and analytics.';

// Manually writing the inner HTML code of the div tag
// We are writing the text and then putting in a button to close the message
message.innerHTML = 'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got It!</button>';

// Adding message element to the html page
// message is added to the header as the first child (prepending)
// header.prepend(message);

// Same as above but this adds message to the header as the last child (appending)
// After doing this we see that the message is appended and not prepended
// This is because an html element cannot be in two places at once so it is first prepended then
// after the below call it is moved from there to the end and is appended
header.append(message);

// So, since DOM elements are unique, we can use prepend and append to move around existing DOM elements

// This would append a copy of the message node so it is in both places
// The boolean arg in the cloneNode() method is wether we want to make a copy of the selected tag's
// child tags
// document.querySelector('.header').append(message.cloneNode(true));

// element1.before(element2) inserts element2 before element1
// element1.before(element2) inserts element2 after element1

// Deleting Elements

// We are adding functionality to the button included in the message tag
// The button will get rid of the cookie message by deleting it
document.querySelector('.btn--close-cookie').addEventListener('click', function() {
  // This deletes the element from the DOM
  message.remove();
});


// STYLES

// Adding a style to an element
message.style.backgroundColor = '#37383d';
message.style.width = '100%';

// Will log nothing wether the height property does or does not exist
// This is because we did not set that property
console.log(message.style.height);

// Will log this because we set it above
console.log(message.style.backgroundColor);

// getComputedStyle(element).style returns the actual style
// The below code will log the height of the selected elements as is on the page
console.log(getComputedStyle(message).height);

// Changing the height based on the actual current height
// We use parseFloat since the height is a float in the form XX.XXpx
// parseFloat returns a float to which we add 30.0 to then add the 'px' back on and make it a string
message.style.height = Number.parseFloat(getComputedStyle(message).height) + 30 +'px';

/**
 * In CSS we have a :root tag which stores CSS variables
 * 
 * These variables store values which can be applied to properties of different tags
 * 
 * :root {
 *  --color-primary: #5ec576
 * }
 * 
 * If the aboce was in a CSS stylesheet then --color-primary would be a variable we could use
 * throughout the stylesheet
 * 
 * We can manipulate these variables through JavaScript
 * 
 * To access the root style we simply do
 * 
 * document.documentElement.style
 */

// Changes the selected var in the root to the specified value
// --color-primary to orangered
// document.documentElement.style.setProperty('--color-primary', 'orangered');

// ATTRIBUTE

// Classes, id, href and the like are all attributes of html tags
// We can manipulate these with JavaScript

// We are logging some attributes to the console
// Only standard attributes can be accessed this way, not custom
// Class can only be accessed through logo.className
console.log(logo.alt);
console.log(logo.src);

// Another way to get attributes, including custom attributes
console.log(logo.getAttribute('alt'));

// There is an attribute setter
// element.setAttribute('attribute', 'value')
// This can change an existing attribute or add a new one

// Data Attributes

// Data attributes are special HTML attributes that start with the word data
// For example: data-version-number="3.0"

// Suppose we have an element elem with attribute data-version-number
// To access it we cannot simply do elem.data-version-number or elem.getAttribute('data-version-number')
// We must do the following:

// elem.dataset.versionNumber
// We reference dataset and convert the rest of the attribute name to camel case

// CLASSES

// elem.classList.add(class)
// elem.classList.remove(class)
// elem.classList.toggle(class)
// elem.classList.contains(class)

// We have used all of the above

// EVENTS AND EVENT LISTENERS

/**
 * When we use event listeners we have always used 'click' for when an element is clicked.
 * There are many other types.
 * 
 * mouseenter is when the mouse hovers over an element
 * mouseleave is when the mouse stops hovering over an element
 * 
 * There are many many more
 * 
 * An alternative way to adding an event listener is illustrated below
 * 
 * elem.addEventListener('mouseenter', func); //how we've done it
 * 
 * elem.onmouseenter = func; //alternative
 * 
 * This alternative method is older and outdated. The first way allows us to put multiple event
 * listeners on the same element and action. The first and more modern way also allows us to remove 
 * an event listener. We do this by doing the following:
 * 
 * elem.removeEventListener('mouseenter', func);
 * 
 * The function func must be declared elsewhere in both the adding and removing of the event listener.
 */

// EVENT PROPAGATION

const randomInt = (min, max) => Math.floor(Math.random() * (max-min-1));
const randomColor = () => `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;

/**
 
document.querySelector('.nav__link').addEventListener('click', function (e) {

  // This event will bubble up and trigger the click events for both parent elements
  this.style.backgroundColor = randomColor();

  // This will stop event propagation
  // This is generally bad practice
  e.stopPropagation();
  
});

document.querySelector('.nav__links').addEventListener('click', function (e) {

  this.style.backgroundColor = randomColor();

  e.stopPropagation();
  
});

// The third arg of boolean here, set to true, is wether or not the event should be handled
// in the capturing phase or bubbling phase. Event handling hapens in three phases: Once an event 
// occurs the Capturing phase starts as the event is generated in the root of the DOM and then 
// travels down to where the event originates; Then the event is handles in the second phase at
// the element where the event originated; The final phase is the bubbling phase where the event 
// bubbles up but, during this phase, the event, for example a click event, triggers the available
// click events for the parent elements of the target element. Since events are handled in the
// handling and bubbling phases we rarely worry about the capturing phase but, if we set the third
// argument of addEventListener() to true, then the event will instead be handled in the capturing
// phase. With this, the same click event on the nav__link element will be the one that triggers 
// this click event on the parent nav bar but it will execute first during the capture phase instead
// of the bubbling phase. By default the third arg is false.
document.querySelector('.nav').addEventListener('click', function (e) {

  this.style.backgroundColor = randomColor();
  
}, true);

*/

// DOM TRAVERSAL

// Selecting h1 tag
const h1 = document.querySelector('h1');

// Going to child element
console.log(h1.querySelectorAll('.highlight')); // selects a child with the specified class
console.log(h1.childNodes); // gives us nodelist of all child elements
console.log(h1.children); // gives us HTMLCollection of all child elements

// h1.firstElementChild and h1.lastElementChild are self explanatory

// Going to parent elements
console.log(h1.parentNode);
console.log(h1.parentElement);

// h1.closest('.some-class') returns the first parent element with the specified class
// h1.closest('h1') returns h1 itself
// closest is very similar to querySelector except it travels upwards to parents instead of children

// Going to sibling elements
console.log(h1.previousElementSibling); // returns the sibling right before the h1 tag
console.log(h1.nextElementSibling); // returns the sibling right after the h1 tag

// To get all sibling we can get the parent then get all that parent's children