const readdirp = require("readdirp");
const fs = require("fs");
var JavaScriptObfuscator = require("javascript-obfuscator");
const getJsFiles = async (directory) => {
  const files = await readdirp.promise(directory, {
    fileFilter: "*.js",
    directoryFilter: ["!node_modules", "!netlify-plugin-play"],
  });
  return files.map((file) => file.fullPath);
};
const obfuscateCode = async (filePath) => {
  var file = fs.readFileSync(filePath, "utf8");
  // return file;
  var obfuscationResult = await JavaScriptObfuscator.obfuscate(file, {
    compact: false,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 1,
    numbersToExpressions: true,
    simplify: true,
    shuffleStringArray: true,
    splitStrings: true,
    stringArrayThreshold: 1,
  });
  // console.log(obfuscationResult.getObfuscatedCode());
  await fs.writeFile(
    filePath,
    obfuscationResult.getObfuscatedCode(),
    function (err) {
      if (err) {
        return 0;
      }
    }
  );
  return 1;
};
module.exports = {
  onPostBuild: async ({ inputs, constants, utils }) => {
    const jsFiles = await getJsFiles(constants.PUBLISH_DIR);
    try {
      for (const filePath of jsFiles) {
        console.log(filePath);
        await obfuscateCode(filePath);
      }
      console.log("JS files successfully obfustucated!");
    } catch (error) {
      return utils.build.failBuild("Failed to Obfustucate JS.", { error });
    }
  },
};
