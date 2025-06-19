const generateHomePage = () => {
    const mainContainer = document.getElementById('main-container');
    const titleElement = document.querySelector('title');
    
    mainContainer.innerHTML = `
        <div>
            <h2 class="center-content coffee-text">Welcome to the Crazy Coffee Concoctions app!</h2>
            <p class="center-content">
                Here, you can create and save your favorite coffee combinations.
                For a little extra fun, check out what happens when you click the
                "Brew Coffee With a Teapot" button!
            </p>
        </div>
    `;

    if (!titleElement.innerText.startsWith('Crazy')) {
        titleElement.innerText = 'Crazy Coffee Concoctions';
    }
}

export default generateHomePage;