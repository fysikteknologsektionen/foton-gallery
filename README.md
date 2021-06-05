# ftek-foton-gallery
A photo gallery web-application for Foton (Photon) at Fysikteknologsektionen (The Physics Division) at Chalmers University of Technology.

## Installation
The project has post-install hooks to install nested dependencies. Simply install all dependencies by running

    npm install

in the root directory.

## Building for production
To build the project for a production environment, run

    npm run build

in the root directory. This will compile all typescript and build the react project.

## Running a development environment
The project has a built in webpack dev-server (with create-react-app) and uses `ts-node-dev` to run a node dev-server directly from typescript files. These can be started independently from the `client` and `server` directories respectively or simultaneously by running

    npm run dev
 
 in the root directory.

## Acknowledgements
This project is based on the original Foton Webgallery application, found [here](https://github.com/ECarlsson/foton).
  