# ftek-foton-gallery
A photo gallery web-application for Foton (Photon) at Fysikteknologsektionen (The Physics Division) at Chalmers University of Technology.

## Requirements
* Node.js (14.x.x or later)
* MongoDB (4.4.x or later)

Some of the dependencies use external libraries that may have to be built from source if there are no prepackaged versions available for your system. This may require additional build tools.

## Installation
The project has post-install hooks to install nested dependencies. Simply install all dependencies by running

    npm install

in the root directory.

## Configuration
Before building or starting a dev server the project has to be configured. This is done by supplying a `.env` file in the root directory. There is an example configuration file, `.env.example`, which can be used as a template. The default configuration will most likely be sufficient to run the project in development.

The database will be automatically created using the supplied configuration and included schemas the first time the application is run. The database will be empty at first, see [the section on generating dummy content](#Generating%20dummy%20content) on how to generate your first user. All subsequent data can be generated from inside the application.

## Building for production
To build the project for a production environment, run

    npm run build

in the root directory. This will compile all typescript and build the react project. It is important to change the `NODE_ENV` variable in `.env` to `production` when running the project in production since sensitive information may otherwise be exposed to clients.

## Running a development environment
The project has a built in webpack dev-server (with create-react-app) and uses `ts-node-dev` to run a node dev-server which compiles typescript at run time. These can be started independently from the `client` and `server` directories respectively or simultaneously by running

    npm run dev
 
 in the root directory. The webpack server runs on port `3000` by default and is set to proxy requests to port `3001` (see [the previous section on how to configure the project](#Configuration)).

### Generating dummy content
The project includes scripts to generate users and dummy content. These can be run with `ts-node-dev`, or with `node` if the project has been built, from the server directory using:

    npx ts-node-dev ./src/dev/createDummyAlbums.ts
    npx ts-node-dev ./src/dev/createUser.ts

or:

    node ./dist/dev/createDummyAlbums.js
    node ./src/dev/createUser.js

respectively. Note that development packages need to be installed in order to generate dummy albums (but not users). The user details and amount of albums and images to generate can be changed in the respective files.

## Acknowledgements
This project is based on the original Foton Webgallery application, found [here](https://github.com/ECarlsson/foton).
  
