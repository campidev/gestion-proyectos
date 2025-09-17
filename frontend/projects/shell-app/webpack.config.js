const {
  shareAll,
  withModuleFederationPlugin,
} = require("@angular-architects/module-federation/webpack");

 module.exports = withModuleFederationPlugin({
  remotes: {
    mfeAuth: "https://localhost:4201/remoteEntry.js",
    mfeProject: "https://localhost:4202/remoteEntry.js",
    mfeAnalytics: "https://localhost:4203/remoteEntry.js",
  },
  
  shared: {
    ...shareAll({
      singleton: true,
      strictVersion: true,
      requiredVersion: "auto",
    }),
  },
});
