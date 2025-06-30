import { generateSignupPage } from './components/authentication.js';
import { generateTeapotPage } from './utils/errorPages.js';

const titleElement = document.querySelector('title');
const homePageTitle = titleElement.textContent;

const mainContainer = document.getElementById('main-container');
const homePageContent = mainContainer.querySelector('div');

const homeBtn = document.getElementById('home-btn');
const coffeeTeapotBtn = document.getElementById('coffee-with-teapot-btn');
const signupButton = document.getElementById('signup');

initialPageSetup();

function initialPageSetup() {    
    homeBtn.addEventListener('click', generateHomePage);
    signupButton.addEventListener('click', generateSignupPage);
    coffeeTeapotBtn.addEventListener('click', generateTeapotPage);
}

function generateHomePage() {
    titleElement.textContent = homePageTitle;
    mainContainer.replaceChildren(homePageContent);
}