const path = require("path");
const fs = require("fs").promises;
/*
 * Project: Milestone 1
 * File Name: main.js
 * Description:
 *
 * Created Date: Mar 07, 2023
 * Author: Ziyin Zhuang Roger
 *
 */

const IOhandler = require("./IOhandler");
const zipFilePath = path.join(__dirname, "myfile.zip");
const pathUnzipped = path.join(__dirname, "unzipped");
const pathProcessed = path.join(__dirname, "grayscaled");

IOhandler.unzip(zipFilePath, pathUnzipped)
  .then(() => {
    console.log("Extraction operation complete!");
    return IOhandler.readDir(pathUnzipped);
  })
  .then((pathIn) => IOhandler.grayScale(pathIn, pathProcessed))
  .catch((e) => console.log(e));
