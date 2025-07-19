import { generateSignupPage, generateLoginPage } from './components/authentication.js';
import { generateConcoctionsPage } from './components/concoctions.js';
import { generateTeapotPage } from './utils/errorPages.js';

const titleElement = document.querySelector('title');
const homePageTitle = titleElement.textContent;

const mainContainer = document.getElementById('main-container');
const homePageContent = mainContainer.querySelector('div');

const homeBtn = document.getElementById('home-btn');
const signupButton = document.getElementById('signup');
const loginButton = document.getElementById('login');
const concoctionsButton = document.getElementById('display-concoctions');
const coffeeTeapotBtn = document.getElementById('coffee-with-teapot-btn');

initialPageSetup();

function initialPageSetup() {    
    homeBtn.addEventListener('click', generateHomePage);
    signupButton.addEventListener('click', generateSignupPage);
    loginButton.addEventListener('click', generateLoginPage);
    concoctionsButton.addEventListener('click', async () => generateConcoctionsPage());
    coffeeTeapotBtn.addEventListener('click', generateTeapotPage);
}

function generateHomePage() {
    titleElement.textContent = homePageTitle;
    mainContainer.replaceChildren(homePageContent);
}