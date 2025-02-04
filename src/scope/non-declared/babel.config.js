module.exports = function(api) {
  api.cache(true); // you are instructing Babel to cache the computed configuration and reuse it on subsequent builds. This can significantly improve build performance because Babel doesn't need to re-evaluate the configuration on every build.

  const defaultEnv = {
    plugins: [
      ["./nondeclared.mjs", { "varName": "m" }]
    ]
  };

  const customEnv = {
    plugins: [
      ["./nondeclared.mjs", { "varName": "n" }]
    ]
  };

  return {
    env: {
      development: defaultEnv,
      custom: customEnv
    }
  };
};