const generateHomePage = () => {
    const mainContainer = document.getElementById('main-container');
    
    mainContainer.innerHTML = `
        <div>
            <h2>Welcome to the Crazy Coffee Concoctions app!</h2>
            <p>
                Here, you can create and save your favorite coffee combinations.
                For a little extra fun, check out what happens when you click the
                "Brew Coffee With a Teapot" button!
            </p>
        </div>
    `;
}

export default generateHomePage;