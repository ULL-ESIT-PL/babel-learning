module.exports = function(api) {
  api.cache(true);

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