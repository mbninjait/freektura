module.exports = {
  packagerConfig: {
    asar: true,
    icon: 'icon.png'
  },
  rebuildConfig: {},
  makers: [
    /*{
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },*/
    {
      name: "@rabbitholesyndrome/electron-forge-maker-portable",
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
  ],
};
