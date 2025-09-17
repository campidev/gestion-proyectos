const {
  shareAll,
  withModuleFederationPlugin,
} = require("@angular-architects/module-federation/webpack");

module.exports = withModuleFederationPlugin({
  name: "mfeProject",
  filename: "remoteEntry.js",
  exposes: {
    "./ProjectRoutes": "./projects/mfe-project/src/app/app.routes.ts",
  },
    remotes: {
    mfeAuth: "https://localhost:4201/remoteEntry.js"  
  },

  shared: {
    ...shareAll({
      singleton: true,
      strictVersion: true,
      requiredVersion: "auto"
    
    }),
  },  

  
 
});

