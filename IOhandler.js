/*
 * Project: Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date: Mar 07, 2023
 * Author: Ziyin Zhuang Roger
 *
 */

const unzipper = require("unzipper"),
  fs = require("fs").promises,
  PNG = require("pngjs").PNG,
  path = require("path");
const { createReadStream, createWriteStream } = require("fs");

/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */
const unzip = (pathIn, pathOut) => {
  const rs = createReadStream(pathIn);
  const extract = unzipper.Extract({ path: pathOut });
  return rs.pipe(extract).promise();
};

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */
const readDir = (dir) => {
  return new Promise((resolve, reject) => {
    fs.readdir(dir)
      .then((files) => {
        const pngFiles = files.filter((file) => path.extname(file) === ".png");
        const filePaths = pngFiles.map((pngFile) => path.join(dir, pngFile));
        resolve(filePaths);
      })
      .catch((e) => reject(e));
  });
};

/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */
const grayScale = (pathIn, pathOut) => {
  return new Promise((resolve, reject) => {
    const processNextFile = (filePaths) => {
      if (filePaths.length === 0) {
        resolve("done!");
        return;
      }

      const filePath = filePaths.shift();

      createReadStream(filePath)
        .pipe(
          new PNG({
            filterType: 4,
          })
        )
        .on("parsed", function () {
          for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
              var idx = (this.width * y + x) << 2;

              // invert color
              this.data[idx] = 255 - this.data[idx];
              this.data[idx + 1] = 255 - this.data[idx + 1];
              this.data[idx + 2] = 255 - this.data[idx + 2];

              // and reduce opacity
              this.data[idx + 3] = this.data[idx + 3] >> 1;
            }
          }
          this.pack()
            .pipe(
              createWriteStream(path.join(pathOut, path.basename(filePath)))
            )
            .on("finish", () => processNextFile(filePaths))
            .on("error", (e) => reject(e));
        });
    };

    processNextFile(pathIn);
  });
};

module.exports = {
  unzip,
  readDir,
  grayScale,
};
