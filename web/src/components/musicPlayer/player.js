// 发布者类
class Dispatcher {
  constructor() {
    this.handlers = {};
  }

  listen(name, handler) {
    this.handlers[name] = handler;
  }

  emit(...args) {
    Object.keys(this.handlers).forEach(handler => {
      this.handlers[handler](...args);
    });
  }
}
// 统计切歌次数
let num = 0;
class Player {
  constructor() {
    // 初始化
    this.audio = new Audio();
    this.playList = [];
    this.playIndex = 0;
    //0：列表循环
    //1：单曲循环
    //2：随机播放
    this.playType = 0;
    this.prevIndex = -1;

    // 添加发布者类
    this.onListComplete = new Dispatcher();
    this.onPlay = new Dispatcher();
    this.onPause = new Dispatcher();
    this.onLoading = new Dispatcher();
    this.onLoadingEnd = new Dispatcher();
    this.onChange = new Dispatcher();
    this.onError = new Dispatcher();
    this.onPlayTypeChange = new Dispatcher();
    this.onMuted = new Dispatcher();
    this.onNext = new Dispatcher();
    this.onPrev = new Dispatcher();
    this.onPlayTarget = new Dispatcher();
  }

  // 初始化歌曲列表
  getList(list) {
    if (Array.isArray(list)) {
      this.playList = list;
      this.onListComplete.emit(this);
      this.change();
    }
  }

  // 切歌
  change() {
    num++;
    this.pause();
    this.onChange.emit(this);
    this.audio.src = this.playList[this.playIndex].url;
  }

  // 调整播放进度
  toTargetTime(val) {
    this.audio.currentTime = val;
  }

  //开始
  play() {
    // 判断是否首次加载
    if (num > 0) {
      this.onLoading.emit(this);
    }
    this.audio
      .play()
      .then(() => {
        this.onPlay.emit(this);
      })
      .catch(() => {
        this.onError.emit(this);
      })
      .finally(() => {
        this.onLoadingEnd.emit(this);
      });
  }

  // 暂停
  pause() {
    this.audio.pause();
    this.onPause.emit(this);
  }

  // 下一首
  next() {
    this.onNext.emit(this);
    switch (this.playType) {
      // 顺序播放
      case 0:
        if (this.playList.length - this.playIndex > 1) {
          this.playIndex++;
        } else {
          this.playIndex = 0;
        }
        break;
      // 单曲循环
      case 1:
        this.play();
        return;
      //随机播放
      case 2:
        this.playIndex = this.randomIndex();
        break;
    }
    this.change();
    this.play();
  }

  // 上一首
  prev() {
    this.onPrev.emit(this);
    switch (this.playType) {
      // 顺序播放
      case 0:
        if (this.playIndex > 0) {
          this.playIndex--;
        } else {
          this.playIndex = this.playList.length - 1;
        }
        break;
      // 单曲循环
      case 1:
        if (this.playIndex > 0) {
          this.playIndex--;
        } else {
          this.playIndex = this.playList.length - 1;
        }
        break;
      //随机播放
      case 2:
        if (this.prevIndex > 0) {
          this.playIndex = this.prevIndex;
        } else {
          this.playIndex = this.randomIndex();
        }
        break;
    }
    this.change();
    this.play();
  }

  //修改播放状态
  changePlayType(type = 0) {
    this.onPlayTypeChange.emit(this);
    this.playType = type;
  }

  //播放指定歌曲
  playTarget(index) {
    this.onPlayTarget.emit(this);
    this.playIndex = index;
    this.change();
    this.play();
  }

  //静音
  toggleMuted() {
    this.audio.muted = !this.audio.muted;
    this.onMuted.emit(this);
  }

  //上一首序号
  changePrevIndex(index) {
    this.prevIndex = index;
  }

  randomIndex() {
    let res;
    while (1) {
      let index = Math.floor(Math.random() * this.playList.length);
      if (index !== this.playIndex && index != this.prevIndex) {
        res = index;
        break;
      }
    }
    return res;
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
  // 获取当前播放歌曲信息
  get current() {
    return this.playList[this.playIndex] || {};
  }
  // 获取当前时常
  get duration() {
    return this.audio.duration ? this.audio.duration : 0.001;
  }
  // 获取当前播放时间
  get currentTime() {
    return this.audio.currentTime ? this.audio.currentTime : 0;
  }
  // 获取播放器状态
  get readyState() {
    return this.audio.readyState;
  }
  // 当前Index
  get currentIndex() {
    return this.playIndex;
  }
}

export const player = new Player();
player.autoplay = false
console.log(player)