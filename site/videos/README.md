# Add a video lesson

1. Copy the video file into this folder. MP4 (H.264 video with AAC audio) is the best-supported choice. WebM is also supported.
2. Create an English subtitle file in WebVTT format (`.vtt`) and copy it into this folder. Start the file with `WEBVTT`; each caption cue needs a start time, end time, and caption text.
3. Open `site/data/video-lessons.js` and add one object inside the `VideoLessons` array. Copy the commented example and update `title`, `src`, and `captions`. Paths start with `videos/` and are relative to the `site` folder.
4. Optionally add a short `description`, a plain-text `transcript`, and a `vocabulary` list. Each vocabulary item can be written as `{ en: 'useful word' }`; viewers can save it to the Learning Lab notebook.
5. Save both files and reload the site. Open **Practice → Learning Lab → Video lessons**.

When working locally, serve the project over HTTP (for example, run `python build.py serve` from the project root and open the local address it prints). Browsers can restrict captions or media loaded from a `file://` page. The same relative paths work after deploying the `site/` contents to a web host.

Example WebVTT file:

```text
WEBVTT

00:00:00.000 --> 00:00:02.500
Hello, welcome to the market.
```

Use one subtitle cue per spoken segment. Keep video files reasonably small for faster page loads and easier deployment. Video files stream directly and are not saved to the app's offline cache. If publishing the project, include the videos and subtitle files in the same deployment; the catalogue does not upload files for you.
