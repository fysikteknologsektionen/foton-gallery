# foton-gallery
A photo gallery web-application for Foton (Photon) at Fysikteknologsektionen (The Physics Division) at Chalmers University of Technology.

## Requirements
* Node.js (14.x.x - 16.x.x)
* MongoDB (4.4.x or later)
* Google OAuth 2.0 client ([Read about](https://developers.google.com/identity/protocols/oauth2))

Some of the dependencies use external libraries that may have to be built from source if there are no prepackaged versions available for your system. This may require additional build tools.

## Installation
The project has post-install hooks to install nested dependencies. Simply install all dependencies by running

    npm install

in the root directory.

## Configuration
Before building or starting a dev server the project has to be configured. This is done by supplying a `.env` file in the root directory. There is an example configuration file, `.env.example`, which can be used as a template.

### Google OAuth 2.0
The project uses Google OAuth 2.0 for authenticating users. For this to work you must first create a new project at the [Google Cloud Console](https://console.cloud.google.com), then configure the OAuth consent screen and finally create a new OAuth 2.0 client ID (All of this can be found under the `APIs & Services` tab).

When configuring the OAuth consent screen the `profile` and `email` scopes must be included for the application to work. When creating the client ID  `Authorized JavaScript origins` should be set to the top level url, i.e. `https://foton.ftek.se` and `Authorized redirect URIs` should be set to the `/api/auth/google/callback` subdirectory, i.e. `https://foton.ftek.se/api/auth/google/callback` (Make sure there's no trailing slash after, i.e. `https://foton.ftek.se/api/auth/google/callback/` will not work).

In addition to any domain-restrictions imposed by the OAuth 2.0 client (i.e. if setting it to internal users only), the application uses a regular expression match to check for allowed emails. The regular expression should be set in the `.env` file.


## Building for production
To build the project for a production environment, run

    npm run build

in the root directory. This will compile all typescript and build the react project. It is important to change the `NODE_ENV` variable in `.env` to `production` when running the project in production since sensitive information may otherwise be exposed to clients.

## Running a development environment
The project has a built in webpack dev-server (with create-react-app) and uses `ts-node-dev` to run a node dev-server which compiles typescript at run time. These can be started independently from the `client` and `server` directories respectively or simultaneously by running

    npm run dev

 in the root directory. The webpack server runs on port `3000` by default and is set to proxy requests to port `3001` (see [the previous section on how to configure the project](#Configuration)).

### Generating dummy content
The project includes a script to generate dummy content for development. This can be run with `ts-node-dev`, or with `node` if the project has been built, from the server directory using:

    npx ts-node-dev ./src/dev/createDummyAlbums.ts

or:

    node ./dist/dev/createDummyAlbums.js

respectively. Note that development packages need to be installed in order to generate dummy content.
