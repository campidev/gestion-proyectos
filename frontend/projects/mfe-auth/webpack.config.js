const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({

  name: 'mfeAuth',
filename: "remoteEntry.js",
  exposes: {
    './AuthRoutes': './projects/mfe-auth/src/app/app.routes.ts',    
    './RolesRoutes': './projects/mfe-auth/src/app/roles.routes.ts',
    './ProfileRoutes': './projects/mfe-auth/src/app/profile.routes.ts',
    './AuthService': './projects/mfe-auth/src/app/shared/services/auth.service.ts'
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },

});
