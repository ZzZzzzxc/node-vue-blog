class Dispatcher {
  constructor() {
    this.handlers = [];
  }

  listen(handler) {
    this.handlers.push(handler);
  }

  emit(...args) {
    this.handlers.forEach(handler => {
      handler(...args);
    });
  }
}

class Player {
  constructor() {
    this.audio = new Audio();
    this.playList = [];
    this.playIndex = 0;

    this.onPlay = new Dispatcher();
    this.onPause = new Dispatcher();
    this.onChange = new Dispatcher();
  }

  getList(list) {
    if (Array.isArray(list)) {
      this.playList = list;
      this.change();
    }
  }

  change() {
    this.onChange.emit(this);
    this.audio.src = this.playList[this.playIndex].url;
  }

  toTargetTime(val) {
    this.audio.currentTime = val;
  }

  play() {
    this.audio
      .play()
      .then(() => {
        console.log("开始播放");
      })
      .catch(() => {
        console.log("播放错误");
      });
    this.onPlay.emit(this);
  }

  pause() {
    this.audio.pause();
    this.onPause.emit(this);
  }

  next() {
    if (this.playList.length - this.playIndex > 1) {
      this.playIndex++;
    } else {
      this.playIndex = 0;
    }
    this.change();
    this.play();
  }

  prev() {
    if (this.playIndex > 0) {
      this.playIndex--;
    } else {
      this.playIndex = this.playList.length - 1;
    }
    this.change();
    this.play();
  }

  muted() {
    this.audio.muted = !this.audio.muted;
  }

  // 1：正常速度
  // 0.5：半速
  // 2：倍速
  // -1：向后正常速度
  // -0.5：向后半速
  playbackRate() {}
  // 0-1
  volume() {}

  get buffered() {
    return this.audio.buffered;
  }

  get current() {
    return this.playList[this.playIndex] || {};
  }

  get duration() {
    return this.audio.duration ? this.audio.duration : 0.001;
  }
  get currentTime() {
    return this.audio.currentTime ? this.audio.currentTime : 0;
  }

  get readyState() {
    return this.audio.readyState;
  }
}

export const player = new Player();
