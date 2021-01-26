const readdirp = require("readdirp");
const gulp = require("gulp");
const javascriptObfuscator = require("gulp-javascript-obfuscator");
const getJsFiles = async (directory) => {
  const files = await readdirp.promise(directory, {
    fileFilter: "*.js",
    directoryFilter: ["!node_modules", "!netlify-plugin-play"],
  });

  return files.map((file) => file.fullPath);
};

module.exports = {
  onPostBuild: async ({ inputs, constants, utils }) => {
    console.log("JS OBF Initialized");
    console.log(constants);
    const jsFiles = await getJsFiles(constants.PUBLISH_DIR);
    try {
      //   process.setMaxListeners(inputs.dimensions.length + 1);
      for (const filePath of jsFiles) {
        console.log(
          1,
          filePath,
          filePath.substring(0, filePath.lastIndexOf("/") + 1)
        );

        await gulp
          .src(filePath)
          .pipe(javascriptObfuscator())
          .pipe(
            gulp.dest(filePath.substring(0, filePath.lastIndexOf("/") + 1))
          );
      }
      console.log("JS files successfully obfustucated!");
    } catch (error) {
      return utils.build.failBuild("Failed to Obfustucate JS.", { error });
    }
  },
};
