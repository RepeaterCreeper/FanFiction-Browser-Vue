import { ipcMain, dialog } from "electron";
import axios from 'axios';
import urlJoin from 'url-join';
import cheerio from 'cheerio';
import fs from 'fs';

const fetchFanficChapter = async (baseUrl, chapterNum) => {
  const resp = await axios.get(urlJoin(baseUrl, chapterNum.toString()));
  const $ = cheerio.load(resp.data);

  const chapterTitle = $("#chap_select option").eq(chapterNum - 1).text().split(".")[1].trim();
  const textElements = $(".storytext p");

  let chapterContents = "";
  for (let i = 0; i < textElements.length; i++) {
    chapterContents += `<p>${textElements.eq(i).html()}</p>`;
  }

  return {
    page: chapterNum,
    title: chapterTitle,
    contents: chapterContents,
  };
};

const getFanFiction = async (url) => {
  const resp = await axios.get(urlJoin(url, '1'));
  const $ = cheerio.load(resp.data);
  const profileElement = $("#profile_top");

  const info = {
    thumbnail: profileElement.find("img").attr("src"),
    title: profileElement.find("b").text(),
    author: profileElement.find("a[href*='/u/']").text(),
    description: profileElement.find("div").text(),
    metadata: profileElement.find("span.xgray").text().split("-").map(data => data.trim()),
    chapters: $("#chap_select").eq(0).children().length,
    story: [],
  };

  const chapterProms = [];
  for (let i = 1; i <= info.chapters; i++) {
    chapterProms.push(fetchFanficChapter(url, i));
  }
  info.story = await Promise.all(chapterProms);

  return info;
};

/**
 * Action Channel
 * 
 * Responsible for retrieving and saving FanFictions.
 */
ipcMain.on("openFanFiction", (event, args) => {
  let ffObject = {};

  switch (args.action) {
    case "readFicDir":
      readFanFictionDirectory(event, args.path);
      break;
    case "getFicDir":
      dialog.showOpenDialog({
        properties: ["openDirectory"]
      }).then(async (res) => {
        readFanFictionDirectory(event, res.filePaths[0]);
      });
    case "getFicUrl":
      getFanFiction(args.url).then((data) => {
        event.reply("openFanFiction-reply", data);
      });
      break;
  }
})

async function readFanFictionDirectory(event, dir = null) {
  let ffObject = {};

  let files = fs.readdirSync(dir).sort((a, b) => a.localeCompare(b, undefined, {numeric: true, sensitivity: 'base'}));

  let promises = [];

  for (let [index, file] of Object.entries(files)) {
    promises.push(new Promise((resolve, reject) => {
      fs.readFile(`${dir}/${file}`, "utf-8", (err, data) => {
        if (err) throw err;

        let chapter = file.split("_")[1];

        let chapterObject = {
          page: parseInt(index) + 1,
          title: chapter,
          contents: data
        }

        resolve(chapterObject);
      })
    }));
  }

  ffObject["story"] = await Promise.all(promises);

  event.reply("openFanFiction-reply", ffObject);
}