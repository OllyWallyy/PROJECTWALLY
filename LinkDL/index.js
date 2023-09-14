const express = require("express");
const app = express();
const ytdl = require("ytdl-core");
const vidzitDl = require("vidzit-dl");
const cheerio = require("cheerio");
const axios = require("axios");

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  return res.render("index");
});

app.get("/download", async (req, res) => {
  if (req.query.url && req.query.url.includes("youtube.com")) {
    // Download logic for YouTube videos
    const v_id = req.query.url.split("v=")[1];
    try {
      const info = await ytdl.getInfo(req.query.url);
      console.log(info.formats[4]);
      console.log(info.formats[1]);

      return res.render("download", {
        url: "https://www.youtube.com/embed/" + v_id,
        info: info.formats.sort((a, b) => {
          return a.mimeType < b.mimeType;
        }),
      });
    } catch (error) {
      console.error("Error retrieving YouTube video info:", error);
      return res.send("Failed to retrieve YouTube video info.");
    }
  } else if (req.query.redditUrl && req.query.redditUrl.includes("reddit.com")) {
    // Download logic for Reddit videos
    const videoUrl = req.query.redditUrl;
    const redditSaveUrl = `https://redditsave.com/info?url=${encodeURIComponent(
      videoUrl
    )}`;
    return res.redirect(redditSaveUrl);
  } else if (req.query.soundcloudUrl && req.query.soundcloudUrl.includes("soundcloud.com")) {
    // Download logic for SoundCloud songs
    const soundcloudUrl = req.query.soundcloudUrl;
    const soundclouddownloadUrl = `https://downloadsound.cloud/track/?url=${encodeURIComponent(
      soundcloudUrl
    )}`;
    return res.redirect(soundclouddownloadUrl);
  } else if (req.query.twitterUrl && req.query.twitterUrl.includes("twitter.com")) {
    // Download logic for Twitter videos
    const twitterUrl = req.query.twitterUrl;
    const twitterDownloadUrl = `https://ddlvid.com/download?link=${encodeURIComponent(
      twitterUrl
    )}`;
    return res.redirect(twitterDownloadUrl);
  } else if (req.query.tiktokUrl && req.query.tiktokUrl.includes("tiktok.com")) {
    // Download logic for TikTok videos
    const tiktokUrl = req.query.tiktokUrl;
    const x2tiktokUrl = tiktokUrl.replace("tiktok.com", "x2tiktok.com");
    return res.redirect(x2tiktokUrl);
  } else if (req.query.spotifyUrl && req.query.spotifyUrl.includes("spotify.com")) {
    // Redirect logic for Spotify links
    const spotifyUrl = req.query.spotifyUrl;
    const spotifyDownloadUrl = `https://spotify-downloader.com/?link=${encodeURIComponent(
      spotifyUrl
    )}`;
    return res.redirect(spotifyDownloadUrl);
  } else {
    return res.send("Invalid URL.");
  }
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
