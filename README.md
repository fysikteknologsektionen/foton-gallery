# ftek-foton-gallery
A photo gallery web-application for Foton (Photon) at Fysikteknologsektionen (The Physics Division) at Chalmers University of Technology.

## Requirements
* Node.js (14.x.x or later)
* MongoDB (4.4.x or later)

## Installation
The project has post-install hooks to install nested dependencies. Simply install all dependencies by running

    npm install

in the root directory.

## Configuration
Before building or starting a dev server the project has to be configured. This is done by supplying a `.env` file in the root directory. There is an example configuration file, `.env.example`, which can be used as a template. The default configuration will most likely be sufficient to run the project in development.

## Building for production
To build the project for a production environment, run

    npm run build

in the root directory. This will compile all typescript and build the react project.

## Running a development environment
The project has a built in webpack dev-server (with create-react-app) and uses `ts-node-dev` to run a node dev-server directly from typescript files. These can be started independently from the `client` and `server` directories respectively or simultaneously by running

    npm run dev
 
 in the root directory. The webpack server runs on port `3000` by default and is set to proxy requests to port `3001` (see [the previous section on how to configure the project](#Configuration)).

### Generating dummy content
The project includes scripts to generate a dummy admin user and dummy albums. These can be run with `ts-node-dev` from the server directory using:

    npx ts-node-dev ./src/example/createExampleUser.ts
    npx ts-node-dev ./src/example/createExampleAlbums.ts

## Acknowledgements
This project is based on the original Foton Webgallery application, found [here](https://github.com/ECarlsson/foton).
  
