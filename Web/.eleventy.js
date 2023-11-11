module.exports = function(eleventyConfig) {

    eleventyConfig.addPassthroughCopy("./assets");
    eleventyConfig.addPassthroughCopy("./blog");
    eleventyConfig.addPassthroughCopy("./css");

    // Return your Object options:
    return {
      dir: {
        input: "src",
        output: "public"
      }
    }
  };