import { ipcMain, dialog } from "electron";
import fs from 'fs';

/**
 * Action Channel
 * 
 * Responsible for retrieving and saving FanFictions.
 */
ipcMain.on("openFanFiction", (event, args) => {
  let ffObject = {};

  dialog.showOpenDialog({
    properties: ["openDirectory"]
  }).then(async (res) => {
    let files = fs.readdirSync(res.filePaths[0]).sort((a, b) => a.localeCompare(b, undefined, {numeric: true, sensitivity: 'base'}));

    let promises = [];

    for (let [index, file] of Object.entries(files)) {
      promises.push(new Promise((resolve, reject) => {
        fs.readFile(`${res.filePaths[0]}/${file}`, "utf-8", (err, data) => {
          if (err) throw err;

          let chapter = file.split("_")[1];

          let chapterObject = {
            chapter: parseInt(index) + 1,
            title: chapter,
            contents: data
          }

          resolve(chapterObject);
        })
      }));
    }

    ffObject["story"] = await Promise.all(promises);

    event.reply("openFanFiction-reply", ffObject);
  });
})
