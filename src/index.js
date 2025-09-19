import { generateSignupPage, generateLoginPage, logout, confirmProfileDeletion } from './components/authentication.js';
import { generateNewConcoctionPage, generateConcoctionsPage } from './components/concoctions.js';
import { generateTeapotPage } from './utils/errorPages.js';

const titleElement = document.querySelector('title');
const homePageTitle = titleElement.textContent;

const mainContainer = document.getElementById('main-container');
const homePageContent = mainContainer.querySelector('div');

const homeBtn = document.getElementById('home-btn');
const signupButton = document.getElementById('signup');
const loginButton = document.getElementById('login');
const newConcoctionButton = document.getElementById('new-concoction');
const concoctionsButton = document.getElementById('display-concoctions');
const coffeeTeapotBtn = document.getElementById('coffee-with-teapot-btn');
const logoutButton = document.getElementById('logout');
const deleteProfileButton = document.getElementById('delete-profile');

initialPageSetup();

function initialPageSetup() {    
    homeBtn.addEventListener('click', generateHomePage);
    signupButton.addEventListener('click', generateSignupPage);
    loginButton.addEventListener('click', generateLoginPage);
    newConcoctionButton.addEventListener('click', async() => await generateNewConcoctionPage());
    concoctionsButton.addEventListener('click', async () => await generateConcoctionsPage());
    coffeeTeapotBtn.addEventListener('click', generateTeapotPage);
    logoutButton.addEventListener('click', async () => await logout());
    deleteProfileButton.addEventListener('click', confirmProfileDeletion);
}

function generateHomePage() {
    titleElement.textContent = homePageTitle;
    mainContainer.replaceChildren(homePageContent);
}