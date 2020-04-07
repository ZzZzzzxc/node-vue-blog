const timeExp = /\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g;

const tagRegMap = {
  title: "ti",
  artist: "ar",
  album: "al",
  offset: "offset",
  by: "by"
};

let tags, lines;

function initTag(lrc) {
  tags = [];
  for (let tag in tagRegMap) {
    const matches = lrc.match(
      new RegExp(`\\[${tagRegMap[tag]}:([^\\]]*)]`, "i")
    );
    tags[tag] = (matches && matches[1]) || "";
  }
}

function initLine(lrc) {
  lines = [];
  const tmp = lrc.split("\n");
  const offset = parseInt(tags["offset"]) || 0;
  for (let i = 0; i < tmp.length; i++) {
    const line = tmp[i];
    const t = line.match(timeExp);
    if (!t) {
      continue;
    }
    const txt = line.replace(timeExp, "").trim();
    if (txt) {
      // 此处正则去掉/g，从头开始匹配
      let time,
        _timeExp = /\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/;
      for (let j = 0; j < t.length; j++) {
        time = _timeExp.exec(t[j]);
        lines.push({
          time:
            Number(time[1]) * 60 +
            Number(time[2]) +
            Number(time[3] || 0) / 100 +
            offset,
          txt
        });
      }
    }
  }

  lines.sort((a, b) => {
    return a.time - b.time;
  });
}

export function parseLrc(lrc) {
  initTag(lrc);
  initLine(lrc);
  return lines;
}
