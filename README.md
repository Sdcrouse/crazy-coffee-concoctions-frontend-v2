# crazy-coffee-concoctions-v2
An updated version of the Crazy Coffee Concoctions app. This new frontend connects to a Node.js backend.

## Prerequisites

If you want to play around with this app, you will need to have Docker installed on your machine.

## Usage

### Starting the app

First, follow the instructions on the [Crazy Coffee Concoctions backend](https://github.com/Sdcrouse/crazy-coffee-concoctions-backend-v2) to start the server.

Next, come back to the frontend. From your terminal, navigate to this project's root directory. Run the following Docker commands:

- `docker build -t crazy-coffee-concoctions-frontend .`
- `docker run -d -p 5500:80 -v "$(pwd):/usr/share/nginx/html" crazy-coffee-concoctions-frontend`

Finally, navigate to http://127.0.0.1:5500/ (**Note:** http://localhost:5500/ will NOT work! The backend will return a CORS error). You should now be able to create an account, login, and create your favorite crazy coffee concoctions!

**Note:** Once you build the Docker container, you will not need to rebuild it unless you update or delete it. From now on, you can start the app by running the `docker run` command.

### Stopping the app

To stop the app, follow the [instructions on the backend](https://github.com/Sdcrouse/crazy-coffee-concoctions-backend-v2) to shut down the server.

Come back to the frontend and open a terminal. Navigate to this project's root directory.

Run this Docker command: `docker ps`. Copy the CONTAINER ID that corresponds to the crazy-coffee-concoctions-frontend container.

Finally, run the Docker command `docker stop <container_id>` (paste in the container id that you just copied).