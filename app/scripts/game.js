(function() {
  window.Game = {
    init: function() {
      var Q;
      this.Q = Q = Quintus({
        development: true,
        audioSupported: ['ogg', 'mp3']
      });
      Q.include("Sprites, Scenes, Input, Touch, UI, 2D, Anim, Audio");
      Q.setup({
        maximize: true,
        upsampleWidth: 640,
        upsampleHeight: 320
      });
      Q.controls().touch();
      Q.enableSound();
      Game.storageKey = "zombieGame:availableLevel";
      Game.availableLevel = localStorage.getItem(Game.storageKey) || 1;
      this.SPRITE_NONE = 0;
      this.SPRITE_PLAYER = 1;
      this.SPRITE_TILES = 2;
      this.SPRITE_ENEMY = 4;
      this.SPRITE_BULLET = 8;
      this.SPRITE_PLAYER_COLLECTIBLE = 16;
      this.SPRITE_HUMAN = 32;
      this.SPRITE_ZOMBIE_PLAYER = 64;
      this.SPRITE_ALL = 0xFFFF;
      this.prepareAssets();
      this.initStats();
      Q.tilePos = function(col, row, otherParams) {
        var position;
        if (otherParams == null) {
          otherParams = {};
        }
        position = {
          x: col * Game.assets.map.tileSize + Game.assets.map.tileSize / 2,
          y: row * Game.assets.map.tileSize + Game.assets.map.tileSize / 2
        };
        return Q._extend(position, otherParams);
      };
    },
    prepareAssets: function() {
      var assetsAsArray, audioAsArray;
      this.assets = {
        characters: {
          dataAsset: "characters.json",
          sheet: "characters.png"
        },
        items: {
          dataAsset: "items.json",
          sheet: "items.png"
        },
        map: {
          sheet: "map_tiles.png",
          bg: "bg.png"
        },
        level1: {
          dataAsset: "level1.tmx"
        },
        level2: {
          dataAsset: "level2.tmx"
        },
        level3: {
          dataAsset: "level3.tmx"
        },
        level4: {
          dataAsset: "level4.tmx"
        },
        level5: {
          dataAsset: "level5.tmx"
        },
        level6: {
          dataAsset: "level6.tmx"
        }
      };
      this.audio = {
        zombieMode: "zombie_mode.mp3",
        playerBg: "player_bg.mp3",
        zombieNotice: "zombie_notice.mp3",
        gunShot: "gun_shot.mp3",
        collected: "collected.mp3",
        playerHit: "player_hit.mp3",
        humanCreated: "human_created.mp3"
      };
      assetsAsArray = [];
      this.objValueToArray(this.assets, assetsAsArray);
      this.assets.map.sheetName = "tiles";
      this.assets.map.tileSize = 70;
      audioAsArray = [];
      this.objValueToArray(this.audio, audioAsArray);
      return this.assets.all = assetsAsArray.concat(audioAsArray);
    },
    objValueToArray: function(obj, array) {
      var key, value, _results;
      _results = [];
      for (key in obj) {
        value = obj[key];
        if (typeof value === 'string') {
          _results.push(array.push(value));
        } else {
          _results.push(this.objValueToArray(value, array));
        }
      }
      return _results;
    },
    initStats: function() {
      var stats;
      this.Q.stats = stats = new Stats();
      stats.setMode(0);
      stats.domElement.style.position = 'absolute';
      stats.domElement.style.left = '0px';
      stats.domElement.style.top = '40px';
      return document.body.appendChild(stats.domElement);
    },
    stageLevel: function(number) {
      var Q;
      if (number == null) {
        number = 1;
      }
      Q = this.Q;
      Q.state.reset({
        enemiesCounter: 0,
        lives: 3,
        bullets: 12,
        hasKey: false,
        hasGun: false,
        currentLevel: number
      });
      Q.input.touchControls();
      Q.clearStages();
      Q.stageScene("level" + number, {
        sort: true
      });
      Q.stageScene("stats", 1);
      return Game.infoLabel.intro();
    },
    stageLevelSelectScreen: function() {
      this.Q.clearStages();
      return this.Q.stageScene("levelSelect");
    },
    stageEndLevelScreen: function() {
      this.Q.clearStages();
      return this.Q.stageScene("end");
    },
    stageStartScreen: function() {},
    setCameraTo: function(stage, toFollowObj) {
      return stage.follow(toFollowObj, {
        x: true,
        y: true
      }, {
        minX: 0,
        maxX: Game.map.p.w,
        minY: 0,
        maxY: Game.map.p.h
      });
    }
  };

  Game.init();

}).call(this);

(function() {
  var Q;

  Q = Game.Q;

  Q.AudioManager = {
    collection: [],
    muted: false,
    add: function(audio, options) {
      var item;
      item = {
        audio: audio,
        options: options
      };
      if ((options != null ? options.loop : void 0) === true) {
        this.collection.push(item);
      }
      if (!this.muted) {
        return Q.audio.play(item.audio, item.options);
      }
    },
    remove: function(audio) {
      var index, indexToRemove, item, _i, _len, _ref;
      indexToRemove = null;
      _ref = this.collection;
      for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
        item = _ref[index];
        if (item.audio === audio) {
          indexToRemove = index;
          Q.audio.stop(item.audio);
        }
      }
      return this.collection.splice(indexToRemove, 1);
    },
    playAll: function() {
      var item, _i, _len, _ref, _results;
      _ref = this.collection;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        _results.push(Q.audio.play(item.audio, item.options));
      }
      return _results;
    },
    stopAll: function() {
      return Q.audio.stop();
    },
    mute: function() {
      this.muted = true;
      return this.stopAll();
    },
    unmute: function() {
      this.muted = false;
      return this.playAll();
    }
  };

}).call(this);

(function() {
  var Q;

  Q = Game.Q;

  Q.component("gun", {
    added: function() {
      var p;
      Q.input.on("fire", this.entity, "fireGun");
      p = this.entity.p;
      p.noOfBullets = Q.state.get("bullets");
      p.sheet = "player_with_gun";
      p.sprite = "playerWithGun";
      this.entity.play("stand");
      return p.nextFireTimeout = 0;
    },
    destroyed: function() {
      return Q.input.off("fire", this.entity);
    },
    extend: {
      gunStep: function(dt) {
        if (this.p.nextFireTimeout > 0) {
          return this.p.nextFireTimeout = Math.max(this.p.nextFireTimeout - dt, 0);
        }
      },
      fireGun: function() {
        var bullet, delta;
        if (this.p.nextFireTimeout === 0) {
          this.p.nextFireTimeout = 0.5;
          this.p.noOfBullets -= 1;
          if (this.p.noOfBullets >= 0) {
            Q.state.set("bullets", this.p.noOfBullets);
          }
          if (this.p.noOfBullets > 0) {
            if (this.p.direction === "left") {
              delta = -15;
            } else {
              delta = 15;
            }
            Q.AudioManager.add(Game.audio.gunShot);
            return bullet = this.stage.insert(new Q.Bullet({
              x: this.p.x + delta,
              y: this.p.y + 3,
              direction: this.p.direction
            }));
          } else {
            return Game.infoLabel.outOfBullets();
          }
        }
      }
    }
  });

}).call(this);

(function() {
  var Q;

  Q = Game.Q;

  Q.component("zombieAI", {
    added: function() {
      var p;
      p = this.entity.p;
      if (p.startLeft === true) {
        p.vx = 60;
      } else {
        p.vx = -60;
      }
      return p.audioTimeout = 0;
    },
    extend: {
      zombieStep: function(dt) {
        var dirX, ground, nextTile;
        this.canSeeThePlayer();
        if (this.canSeeThePlayerObj.status) {
          this.p.canSeeThePlayerTimeout = 3;
          if (this.canSeeThePlayerObj.playAudio) {
            if (this.p.audioTimeout === 0) {
              Q.AudioManager.add(Game.audio.zombieNotice);
              this.play("attack", 10);
              this.p.audioTimeout = 10;
            }
          }
          if ((this.canSeeThePlayerObj.left && this.p.vx > 0) || (this.canSeeThePlayerObj.right && this.p.vx < 0)) {
            this.p.vx = -this.p.vx;
          }
        } else {
          this.p.canSeeThePlayerTimeout = Math.max(this.p.canSeeThePlayerTimeout - dt, 0);
        }
        this.p.audioTimeout = Math.max(this.p.audioTimeout - dt, 0);
        dirX = this.p.vx / Math.abs(this.p.vx);
        ground = Q.stage().locate(this.p.x, this.p.y + this.p.h / 2 + 1, Game.SPRITE_TILES);
        nextTile = Q.stage().locate(this.p.x + dirX * this.p.w / 2 + dirX, this.p.y + this.p.h / 2 + 1, Game.SPRITE_TILES);
        if (!nextTile && ground && !this.canSeeThePlayerObj.status && this.p.canSeeThePlayerTimeout === 0) {
          this.p.vx = -this.p.vx;
        }
        return this.flip();
      },
      flip: function() {
        if (this.p.vx > 0) {
          return this.p.flip = false;
        } else {
          return this.p.flip = "x";
        }
      },
      canSeeThePlayer: function() {
        var isCloseFromLeft, isCloseFromRight, isTheSameY, lineOfSight, oldObj, player;
        player = Game.player.p;
        lineOfSight = 350;
        oldObj = this.canSeeThePlayerObj;
        this.canSeeThePlayerObj = {
          playAudio: true,
          status: false
        };
        if ((oldObj != null ? oldObj.status : void 0) === true) {
          this.canSeeThePlayerObj.playAudio = false;
        }
        if (Game.player.isDestroyed != null) {
          return;
        }
        isTheSameY = player.y > this.p.y - 10 && player.y < this.p.y + 10;
        this.canSeeThePlayerObj.left = isCloseFromLeft = (player.x > this.p.x - lineOfSight) && player.x < this.p.x;
        this.canSeeThePlayerObj.right = isCloseFromRight = (player.x < this.p.x + lineOfSight) && player.x > this.p.x;
        if (isTheSameY && (isCloseFromLeft || isCloseFromRight)) {
          this.canSeeThePlayerObj.status = true;
        } else {
          this.canSeeThePlayerObj.status = false;
          this.canSeeThePlayerObj.playAudio = true;
        }
      }
    }
  });

}).call(this);

(function() {
  var Q;

  Q = Game.Q;

  Q.load(Game.assets.all, function() {
    Q.sheet(Game.assets.map.sheetName, Game.assets.map.sheet, {
      tileW: Game.assets.map.tileSize,
      tileH: Game.assets.map.tileSize
    });
    Q.compileSheets(Game.assets.characters.sheet, Game.assets.characters.dataAsset);
    Q.compileSheets(Game.assets.items.sheet, Game.assets.items.dataAsset);
    return Game.stageLevelSelectScreen();
  }, {
    progressCallback: function(loaded, total) {
      var container, element;
      element = document.getElementById("loading-progress");
      element.style.width = Math.floor(loaded / total * 100) + "%";
      if (loaded === total) {
        container = document.getElementById("loading");
        return container.parentNode.removeChild(container);
      }
    }
  });

}).call(this);

(function() {
  var Q;

  Q = Game.Q;

  Q.scene("end", function(stage) {
    var button, container, label;
    container = stage.insert(new Q.UI.Container({
      x: Q.width / 2,
      y: Q.height / 2,
      w: Q.width,
      h: Q.height,
      fill: "rgba(0,0,0,0.5)"
    }));
    button = container.insert(new Q.UI.Button({
      x: 0,
      y: 0,
      fill: "#CCCCCC",
      label: "Play Next",
      keyActionName: "confirm",
      type: Q.SPRITE_UI | Q.SPRITE_DEFAULT
    }));
    label = container.insert(new Q.UI.Text({
      x: 10,
      y: -10 - button.p.h,
      label: "You did it!"
    }));
    button.on("click", function(e) {
      return Game.stageLevelSelectScreen();
    });
    container.fit(20);
    if (Q.state.get("currentLevel") >= Game.availableLevel) {
      Game.availableLevel = Q.state.get("currentLevel") + 1;
      return localStorage.setItem(Game.storageKey, Game.availableLevel);
    }
  });

}).call(this);

(function() {
  var Q;

  Q = Game.Q;

  Q.scene("level1", function(stage) {
    var background, enemies, items, map, player;
    Game.map = map = new Q.TileLayer({
      type: Game.SPRITE_TILES,
      layerIndex: 0,
      dataAsset: Game.assets.level1.dataAsset,
      sheet: Game.assets.map.sheetName,
      tileW: Game.assets.map.tileSize,
      tileH: Game.assets.map.tileSize,
      z: 2
    });
    stage.collisionLayer(map);
    background = new Q.TileLayer({
      layerIndex: 1,
      type: Game.SPRITE_NONE,
      dataAsset: Game.assets.level1.dataAsset,
      sheet: Game.assets.map.sheetName,
      tileW: Game.assets.map.tileSize,
      tileH: Game.assets.map.tileSize,
      z: 1
    });
    stage.insert(background);
    Game.player = player = stage.insert(new Q.Player(Q.tilePos(3.5, 9)));
    stage.add("viewport");
    Game.setCameraTo(stage, player);
    enemies = [["Zombie", Q.tilePos(14, 9)]];
    stage.loadAssets(enemies);
    items = [["Key", Q.tilePos(14.5, 9)], ["Door", Q.tilePos(27, 9)], ["ExitSign", Q.tilePos(24, 9)], ["Heart", Q.tilePos(14.5, 3)], ["Heart", Q.tilePos(14.5, 15)]];
    return stage.loadAssets(items);
  });

}).call(this);

(function() {
  var Q;

  Q = Game.Q;

  Q.scene("level2", function(stage) {
    var background, enemies, items, map, player, random, randomItems;
    Game.map = map = new Q.TileLayer({
      type: Game.SPRITE_TILES,
      layerIndex: 0,
      dataAsset: Game.assets.level2.dataAsset,
      sheet: Game.assets.map.sheetName,
      tileW: Game.assets.map.tileSize,
      tileH: Game.assets.map.tileSize,
      z: 2
    });
    stage.collisionLayer(map);
    background = new Q.TileLayer({
      layerIndex: 1,
      type: Game.SPRITE_NONE,
      dataAsset: Game.assets.level2.dataAsset,
      sheet: Game.assets.map.sheetName,
      tileW: Game.assets.map.tileSize,
      tileH: Game.assets.map.tileSize,
      z: 1
    });
    stage.insert(background);
    Game.player = player = stage.insert(new Q.Player(Q.tilePos(2.5, 9)));
    stage.add("viewport");
    Game.setCameraTo(stage, player);
    enemies = [
      ["Zombie", Q.tilePos(9, 6)], [
        "Zombie", Q.tilePos(8, 12, {
          startLeft: true
        })
      ], [
        "Zombie", Q.tilePos(20, 6, {
          startLeft: true
        })
      ], ["Zombie", Q.tilePos(21, 12)]
    ];
    stage.loadAssets(enemies);
    randomItems = [
      {
        health: Q.tilePos(14.5, 15),
        key: Q.tilePos(14.5, 3)
      }, {
        health: Q.tilePos(14.5, 3),
        key: Q.tilePos(14.5, 15)
      }
    ];
    random = Math.floor(Math.random() * 2);
    items = [["Key", randomItems[random].key], ["Door", Q.tilePos(27, 9)], ["ExitSign", Q.tilePos(26, 9)], ["Gun", Q.tilePos(14.5, 9)], ["Heart", randomItems[random].health]];
    return stage.loadAssets(items);
  });

}).call(this);

(function() {
  var Q;

  Q = Game.Q;

  Q.scene("level3", function(stage) {
    var background, enemies, items, map, player, random, randomItems;
    Game.map = map = new Q.TileLayer({
      type: Game.SPRITE_TILES,
      layerIndex: 0,
      dataAsset: Game.assets.level3.dataAsset,
      sheet: Game.assets.map.sheetName,
      tileW: Game.assets.map.tileSize,
      tileH: Game.assets.map.tileSize,
      z: 2
    });
    stage.collisionLayer(map);
    background = new Q.TileLayer({
      layerIndex: 1,
      type: Game.SPRITE_NONE,
      dataAsset: Game.assets.level3.dataAsset,
      sheet: Game.assets.map.sheetName,
      tileW: Game.assets.map.tileSize,
      tileH: Game.assets.map.tileSize,
      z: 1
    });
    stage.insert(background);
    Game.player = player = stage.insert(new Q.Player(Q.tilePos(24.5, 14)));
    stage.add("viewport");
    Game.setCameraTo(stage, player);
    enemies = [
      ["Zombie", Q.tilePos(8, 11)], [
        "Zombie", Q.tilePos(9, 17, {
          startLeft: true
        })
      ], ["Zombie", Q.tilePos(18, 5)], ["Zombie", Q.tilePos(19, 23)], ["Zombie", Q.tilePos(31, 5)], ["Zombie", Q.tilePos(30, 23)], ["Zombie", Q.tilePos(41, 11)], [
        "Zombie", Q.tilePos(42, 17, {
          startLeft: true
        })
      ]
    ];
    stage.loadAssets(enemies);
    randomItems = [
      {
        door: Q.tilePos(47, 14),
        exitSign: Q.tilePos(46, 14),
        key: Q.tilePos(2.5, 14)
      }, {
        door: Q.tilePos(2, 14),
        exitSign: Q.tilePos(3, 14),
        key: Q.tilePos(46.5, 14)
      }
    ];
    random = Math.floor(Math.random() * 2);
    items = [["Key", randomItems[random].key], ["Door", randomItems[random].door], ["ExitSign", randomItems[random].exitSign], ["Gun", Q.tilePos(24.5, 2)], ["Heart", Q.tilePos(8, 5)], ["Heart", Q.tilePos(41.5, 5)], ["Heart", Q.tilePos(24.5, 26)]];
    return stage.loadAssets(items);
  });

}).call(this);

(function() {
  var Q;

  Q = Game.Q;

  Q.scene("level4", function(stage) {
    var background, doorKeyPositions, enemies, gunPositions, items, map, player, random;
    Game.map = map = new Q.TileLayer({
      type: Game.SPRITE_TILES,
      layerIndex: 0,
      dataAsset: Game.assets.level4.dataAsset,
      sheet: Game.assets.map.sheetName,
      tileW: Game.assets.map.tileSize,
      tileH: Game.assets.map.tileSize,
      z: 2
    });
    stage.collisionLayer(map);
    background = new Q.TileLayer({
      layerIndex: 1,
      type: Game.SPRITE_NONE,
      dataAsset: Game.assets.level4.dataAsset,
      sheet: Game.assets.map.sheetName,
      tileW: Game.assets.map.tileSize,
      tileH: Game.assets.map.tileSize,
      z: 1
    });
    stage.insert(background);
    Game.player = player = stage.insert(new Q.Player(Q.tilePos(49.5, 21)));
    stage.add("viewport");
    Game.setCameraTo(stage, player);
    enemies = [
      ["Zombie", Q.tilePos(17, 15)], [
        "Zombie", Q.tilePos(16, 27, {
          startLeft: true
        })
      ], ["Zombie", Q.tilePos(27, 20)], ["Zombie", Q.tilePos(38, 9)], ["Zombie", Q.tilePos(39, 33)], ["Zombie", Q.tilePos(50, 15)], [
        "Zombie", Q.tilePos(49, 27, {
          startLeft: true
        })
      ], ["Zombie", Q.tilePos(61, 9)], ["Zombie", Q.tilePos(60, 33)], ["Zombie", Q.tilePos(72, 21)], [
        "Zombie", Q.tilePos(82, 15, {
          startLeft: true
        })
      ], ["Zombie", Q.tilePos(81, 27)]
    ];
    stage.loadAssets(enemies);
    doorKeyPositions = [
      {
        door: Q.tilePos(50, 2.65),
        sign: Q.tilePos(48, 3),
        key: Q.tilePos(49.5, 38.8),
        heart1: Q.tilePos(5, 20.9),
        heart2: Q.tilePos(94, 20.9)
      }, {
        door: Q.tilePos(49, 38.65),
        sign: Q.tilePos(51, 39),
        key: Q.tilePos(49.5, 2.8),
        heart1: Q.tilePos(5, 20.9),
        heart2: Q.tilePos(94, 20.9)
      }, {
        door: Q.tilePos(4, 20.65),
        sign: Q.tilePos(6, 21),
        key: Q.tilePos(94, 20.8),
        heart1: Q.tilePos(49.5, 38.9),
        heart2: Q.tilePos(49.5, 2.9)
      }, {
        door: Q.tilePos(95, 20.65),
        sign: Q.tilePos(93, 21),
        key: Q.tilePos(5, 20.8),
        heart1: Q.tilePos(49.5, 38.9),
        heart2: Q.tilePos(49.5, 2.9)
      }
    ];
    gunPositions = [Q.tilePos(38, 15), Q.tilePos(62, 15), Q.tilePos(37, 27), Q.tilePos(62, 27)];
    random = Math.floor(Math.random() * 4);
    items = [["Key", doorKeyPositions[random].key], ["Door", doorKeyPositions[random].door], ["ExitSign", doorKeyPositions[random].sign], ["Gun", gunPositions[random]], ["Heart", doorKeyPositions[random].heart1], ["Heart", doorKeyPositions[random].heart2], ["Heart", Q.tilePos(4.5, 5.9)], ["Heart", Q.tilePos(7.5, 38.9)], ["Heart", Q.tilePos(94.5, 6.9)], ["Heart", Q.tilePos(92.5, 36.9)]];
    return stage.loadAssets(items);
  });

}).call(this);

(function() {
  var Q;

  Q = Game.Q;

  Q.scene("level5", function(stage) {
    var background, doorKeyPositions, enemies, gunPositions, items, map, player, random;
    Game.map = map = new Q.TileLayer({
      type: Game.SPRITE_TILES,
      layerIndex: 0,
      dataAsset: Game.assets.level5.dataAsset,
      sheet: Game.assets.map.sheetName,
      tileW: Game.assets.map.tileSize,
      tileH: Game.assets.map.tileSize,
      z: 2
    });
    stage.collisionLayer(map);
    background = new Q.TileLayer({
      layerIndex: 1,
      type: Game.SPRITE_NONE,
      dataAsset: Game.assets.level5.dataAsset,
      sheet: Game.assets.map.sheetName,
      tileW: Game.assets.map.tileSize,
      tileH: Game.assets.map.tileSize,
      z: 1
    });
    stage.insert(background);
    Game.player = player = stage.insert(new Q.Player(Q.tilePos(49.5, 21)));
    stage.add("viewport");
    Game.setCameraTo(stage, player);
    enemies = [
      ["Zombie", Q.tilePos(17, 15)], [
        "Zombie", Q.tilePos(16, 27, {
          startLeft: true
        })
      ], ["Zombie", Q.tilePos(27, 20)], ["Zombie", Q.tilePos(38, 9)], [
        "Zombie", Q.tilePos(39, 15, {
          startLeft: true
        })
      ], ["Zombie", Q.tilePos(39, 27)], [
        "Zombie", Q.tilePos(39, 33, {
          startLeft: true
        })
      ], ["Zombie", Q.tilePos(50, 15)], [
        "Zombie", Q.tilePos(49, 27, {
          startLeft: true
        })
      ], ["Zombie", Q.tilePos(61, 9)], [
        "Zombie", Q.tilePos(60, 15, {
          startLeft: true
        })
      ], ["Zombie", Q.tilePos(60, 27)], [
        "Zombie", Q.tilePos(60, 33, {
          startLeft: true
        })
      ], ["Zombie", Q.tilePos(72, 21)], [
        "Zombie", Q.tilePos(82, 15, {
          startLeft: true
        })
      ], ["Zombie", Q.tilePos(81, 27)]
    ];
    stage.loadAssets(enemies);
    doorKeyPositions = [
      {
        door: Q.tilePos(50, 2.65),
        sign: Q.tilePos(48, 3),
        key: Q.tilePos(49.5, 38.8),
        heart1: Q.tilePos(5, 20.9),
        heart2: Q.tilePos(94, 20.9)
      }, {
        door: Q.tilePos(49, 38.65),
        sign: Q.tilePos(51, 39),
        key: Q.tilePos(49.5, 2.8),
        heart1: Q.tilePos(5, 20.9),
        heart2: Q.tilePos(94, 20.9)
      }, {
        door: Q.tilePos(4, 20.65),
        sign: Q.tilePos(6, 21),
        key: Q.tilePos(94, 20.8),
        heart1: Q.tilePos(49.5, 38.9),
        heart2: Q.tilePos(49.5, 2.9)
      }, {
        door: Q.tilePos(95, 20.65),
        sign: Q.tilePos(93, 21),
        key: Q.tilePos(5, 20.8),
        heart1: Q.tilePos(49.5, 38.9),
        heart2: Q.tilePos(49.5, 2.9)
      }
    ];
    gunPositions = [Q.tilePos(38, 15), Q.tilePos(62, 15), Q.tilePos(37, 27), Q.tilePos(62, 27)];
    random = Math.floor(Math.random() * 4);
    items = [["Key", doorKeyPositions[random].key], ["Door", doorKeyPositions[random].door], ["ExitSign", doorKeyPositions[random].sign], ["Gun", gunPositions[random]], ["Heart", doorKeyPositions[random].heart1], ["Heart", doorKeyPositions[random].heart2], ["Heart", Q.tilePos(4.5, 5.9)], ["Heart", Q.tilePos(7.5, 38.9)], ["Heart", Q.tilePos(94.5, 6.9)], ["Heart", Q.tilePos(92.5, 36.9)]];
    return stage.loadAssets(items);
  });

}).call(this);

(function() {
  var Q;

  Q = Game.Q;

  Q.scene("level6", function(stage) {
    var background, doorKeyPositions, enemies, gunPositions, items, map, player, random;
    Game.map = map = new Q.TileLayer({
      type: Game.SPRITE_TILES,
      layerIndex: 0,
      dataAsset: Game.assets.level6.dataAsset,
      sheet: Game.assets.map.sheetName,
      tileW: Game.assets.map.tileSize,
      tileH: Game.assets.map.tileSize,
      z: 2
    });
    stage.collisionLayer(map);
    background = new Q.TileLayer({
      layerIndex: 1,
      type: Game.SPRITE_NONE,
      dataAsset: Game.assets.level6.dataAsset,
      sheet: Game.assets.map.sheetName,
      tileW: Game.assets.map.tileSize,
      tileH: Game.assets.map.tileSize,
      z: 1
    });
    stage.insert(background);
    Game.player = player = stage.insert(new Q.Player(Q.tilePos(49.5, 21)));
    stage.add("viewport");
    Game.setCameraTo(stage, player);
    enemies = [
      ["Zombie", Q.tilePos(17, 15)], [
        "Zombie", Q.tilePos(16, 21, {
          startLeft: true
        })
      ], ["Zombie", Q.tilePos(17, 27)], [
        "Zombie", Q.tilePos(27, 9, {
          startLeft: true
        })
      ], ["Zombie", Q.tilePos(28, 15)], [
        "Zombie", Q.tilePos(27, 27, {
          startLeft: true
        })
      ], ["Zombie", Q.tilePos(28, 33)], ["Zombie", Q.tilePos(38, 9)], [
        "Zombie", Q.tilePos(39, 21, {
          startLeft: true
        })
      ], ["Zombie", Q.tilePos(39, 33)], ["Zombie", Q.tilePos(50, 9)], [
        "Zombie", Q.tilePos(49, 15, {
          startLeft: true
        })
      ], ["Zombie", Q.tilePos(50, 27)], [
        "Zombie", Q.tilePos(49, 33, {
          startLeft: true
        })
      ], ["Zombie", Q.tilePos(61, 9)], [
        "Zombie", Q.tilePos(60, 21, {
          startLeft: true
        })
      ], ["Zombie", Q.tilePos(60, 33)], ["Zombie", Q.tilePos(72, 9)], [
        "Zombie", Q.tilePos(71, 15, {
          startLeft: true
        })
      ], ["Zombie", Q.tilePos(72, 21)], [
        "Zombie", Q.tilePos(71, 27, {
          startLeft: true
        })
      ], ["Zombie", Q.tilePos(72, 33)], ["Zombie", Q.tilePos(80, 15)], ["Zombie", Q.tilePos(85, 27)]
    ];
    stage.loadAssets(enemies);
    doorKeyPositions = [
      {
        door: Q.tilePos(50, 2.65),
        sign: Q.tilePos(48, 3),
        key: Q.tilePos(49.5, 38.8),
        heart1: Q.tilePos(5, 20.9),
        heart2: Q.tilePos(94, 20.9)
      }, {
        door: Q.tilePos(49, 38.65),
        sign: Q.tilePos(51, 39),
        key: Q.tilePos(49.5, 2.8),
        heart1: Q.tilePos(5, 20.9),
        heart2: Q.tilePos(94, 20.9)
      }, {
        door: Q.tilePos(4, 20.65),
        sign: Q.tilePos(6, 21),
        key: Q.tilePos(94, 20.8),
        heart1: Q.tilePos(49.5, 38.9),
        heart2: Q.tilePos(49.5, 2.9)
      }, {
        door: Q.tilePos(95, 20.65),
        sign: Q.tilePos(93, 21),
        key: Q.tilePos(5, 20.8),
        heart1: Q.tilePos(49.5, 38.9),
        heart2: Q.tilePos(49.5, 2.9)
      }
    ];
    gunPositions = [Q.tilePos(27.5, 9), Q.tilePos(27.5, 33), Q.tilePos(71.5, 9), Q.tilePos(71.5, 33)];
    random = Math.floor(Math.random() * 4);
    items = [["Key", doorKeyPositions[random].key], ["Door", doorKeyPositions[random].door], ["ExitSign", doorKeyPositions[random].sign], ["Gun", gunPositions[random]], ["Heart", doorKeyPositions[random].heart1], ["Heart", doorKeyPositions[random].heart2], ["Heart", Q.tilePos(4.5, 5.9)], ["Heart", Q.tilePos(7.5, 38.9)], ["Heart", Q.tilePos(94.5, 6.9)], ["Heart", Q.tilePos(92.5, 36.9)]];
    return stage.loadAssets(items);
  });

}).call(this);

(function() {
  var Q;

  Q = Game.Q;

  Q.scene("levelSelect", function(stage) {
    var columnInP, columnWidth, columnsNo, enabled, gutterX, gutterXinP, gutterY, gutterYinP, h, item, marginX, marginXinP, marginY, marginYinP, rowHeight, w, x, y, _i;
    marginXinP = 10;
    marginYinP = 20;
    gutterXinP = 8;
    gutterYinP = 8;
    columnsNo = 3;
    columnInP = (100 - (marginXinP * 2) - (columnsNo - 1) * gutterXinP) / columnsNo;
    marginX = Q.width * marginXinP * 0.01;
    gutterX = Q.width * gutterXinP * 0.01;
    columnWidth = Q.width * columnInP * 0.01;
    marginY = Q.height * marginYinP * 0.01;
    gutterY = Q.height * gutterYinP * 0.01;
    rowHeight = Q.height * 0.20;
    x = marginX + columnWidth / 2;
    y = marginY + rowHeight / 2;
    w = columnWidth;
    h = rowHeight;
    for (item = _i = 0; _i <= 5; item = ++_i) {
      if (item % columnsNo === 0) {
        x = marginX + columnWidth / 2;
        if (item > 0) {
          y += rowHeight + gutterY;
        }
      }
      enabled = item + 1 <= Game.availableLevel ? true : false;
      stage.insert(new Q.UI.LevelButton({
        level: item + 1,
        x: x,
        y: y,
        w: w,
        h: h,
        enabled: enabled
      }));
      x += columnWidth + gutterX;
    }
    stage.insert(new Q.UI.Text({
      x: Q.width / 2,
      y: marginY / 2,
      label: "Everything begins here!",
      size: 30,
      color: "#fff",
      family: "Ubuntu"
    }));
    return Q.AudioManager.stopAll();
  });

}).call(this);

(function() {
  var Q;

  Q = Game.Q;

  Q.scene("start", function(stage) {
    var button, container, label;
    container = stage.insert(new Q.UI.Container({
      x: Q.width / 2,
      y: Q.height / 2,
      w: Q.width,
      h: Q.height,
      fill: "rgba(0,0,0,0.5)"
    }));
    button = container.insert(new Q.UI.Button({
      x: 0,
      y: 0,
      fill: "#CCCCCC",
      label: "Let's Play",
      keyActionName: "confirm"
    }));
    label = container.insert(new Q.UI.Text({
      x: 10,
      y: -50 - button.p.h,
      color: "white",
      label: "Another Zombie Game"
    }));
    Game.player.del("platformerControls");
    button.on("click", function(e) {
      Q.clearStage(2);
      return Game.player.add("platformerControls");
    });
    return container.fit(40);
  });

}).call(this);

(function() {
  var Q;

  Q = Game.Q;

  Q.scene("stats", function(stage) {
    var audioButton, bulletsCounterLabel, container, enemiesCounterLabel, lifesLabel, pauseButton;
    container = stage.insert(new Q.UI.Container({
      x: Q.width / 2,
      y: 20,
      w: Q.width,
      h: 40,
      radius: 0
    }));
    lifesLabel = container.insert(new Q.UI.LivesCounter());
    lifesLabel.p.x = -container.p.w / 2 + lifesLabel.p.w / 2 + 20;
    enemiesCounterLabel = container.insert(new Q.UI.EnemiesCounter());
    enemiesCounterLabel.p.x = -container.p.w / 2 + enemiesCounterLabel.p.w / 2 + 160;
    bulletsCounterLabel = container.insert(new Q.UI.BulletsCounter());
    bulletsCounterLabel.p.x = -container.p.w / 2 + bulletsCounterLabel.p.w / 2 + 160;
    Game.infoLabel = new Q.UI.InfoLabel;
    container.insert(Game.infoLabel);
    pauseButton = container.insert(new Q.UI.PauseButton);
    pauseButton.p.x = container.p.w / 2 - 80;
    audioButton = container.insert(new Q.UI.AudioButton);
    return audioButton.p.x = container.p.w / 2 - 80;
  });

}).call(this);

(function() {
  var Q;

  Q = Game.Q;

  Q.Sprite.extend('Background', {
    init: function(p) {
      var ratio;
      this._super(p, {
        x: 0,
        y: 0,
        z: 0,
        asset: Game.assets.map.bg,
        type: Q.SPRITE_NONE
      });
      this.imgEl = this.asset();
      ratio = this.imgEl.width / this.imgEl.height;
      this.imgEl.width = Q.width + 10;
      this.imgEl.height = this.imgEl.width * ratio;
      this.p.deltaX = (this.imgEl.width - Q.width) / 2;
      return this.p.deltaY = (this.imgEl.height - Q.height) / 2;
    },
    draw: function(ctx) {
      var offsetX, offsetY, viewport;
      viewport = this.stage.viewport;
      if (viewport) {
        offsetX = viewport.centerX - Q.width / 2;
        offsetY = viewport.centerY - Q.height / 2;
      } else {
        offsetX = 0;
        offsetY = 0;
      }
      return ctx.drawImage(this.imgEl, offsetX - this.p.deltaX, offsetY - this.p.deltaY, this.imgEl.width, this.imgEl.height);
    }
  });

}).call(this);

(function() {
  var Q;

  Q = Game.Q;

  Q.Sprite.extend("Bullet", {
    init: function(p) {
      this._super(p, {
        color: "red",
        range: Q.width / 2,
        w: 5,
        h: 5,
        speed: 700,
        gravity: 0,
        type: Game.SPRITE_BULLET,
        collisionMask: Game.SPRITE_TILES | Game.SPRITE_ENEMY
      });
      this.add("2d");
      this.p.initialX = this.p.x;
      this.p.initialY = this.p.y;
      return this.on("hit", this, "collision");
    },
    draw: function(ctx) {
      ctx.fillStyle = this.p.color;
      return ctx.fillRect(-this.p.cx, -this.p.cy, this.p.w, this.p.h);
    },
    step: function(dt) {
      if (this.p.direction === "left") {
        this.p.vx = -this.p.speed;
      } else {
        this.p.vx = this.p.speed;
      }
      if (this.p.x > Game.map.width || this.p.x < 0) {
        this.destroy();
      }
      if (this.p.x > this.p.initialX + this.p.range || this.p.x < this.p.initialX - this.p.range) {
        return this.destroy();
      }
    },
    collision: function(col) {
      this.p.x -= col.separate[0];
      this.p.y -= col.separate[1];
      return this.destroy();
    }
  });

}).call(this);

(function() {
  var Q;

  Q = Game.Q;

  Q.animations("human", {
    intro: {
      frames: [0, 1, 2, 3],
      rate: 0.7,
      next: "stand"
    },
    stand: {
      frames: [4, 5, 6],
      rate: 1 / 3
    },
    outro: {
      frames: [3, 2, 1, 0],
      rate: 0.8,
      loop: false,
      trigger: "outro"
    }
  });

  Q.Sprite.extend("Human", {
    init: function(p) {
      this._super(p, {
        x: 0,
        y: 0,
        vx: 0,
        z: 20,
        timeInvincible: 4,
        sheet: "human",
        sprite: "human",
        type: Game.SPRITE_HUMAN,
        collisionMask: Game.SPRITE_TILES,
        sensor: true
      });
      this.add("2d, animation");
      this.play("intro");
      Q.AudioManager.add(Game.audio.humanCreated);
      this.on("sensor", this, "sensor");
      return this.on("outro", this, "die");
    },
    step: function(dt) {
      if (this.p.timeInvincible > 0) {
        return this.p.timeInvincible = Math.max(this.p.timeInvincible - dt, 0);
      }
    },
    sensor: function(obj) {
      if (obj.isA("Zombie") && this.p.timeInvincible === 0) {
        obj.play("attack", 10);
        return this.play("outro");
      }
    },
    die: function() {
      var randomBool, zombie;
      this.destroy();
      randomBool = Math.floor(Math.random() * 2);
      zombie = this.stage.insert(new Q.Zombie({
        x: this.p.x,
        y: this.p.y,
        startLeft: randomBool
      }));
      return zombie.p.wasHuman = true;
    }
  });

}).call(this);

(function() {
  var Q;

  Q = Game.Q;

  Q.animations("player", {
    stand: {
      frames: [2],
      rate: 1
    },
    run: {
      frames: [0, 2, 4, 2],
      rate: 1 / 4
    },
    hit: {
      frames: [3],
      loop: false,
      rate: 1,
      next: "stand"
    },
    jump: {
      frames: [1, 3, 5, 3],
      rate: 1 / 3
    }
  });

  Q.animations("playerWithGun", {
    stand: {
      frames: [2],
      rate: 1
    },
    run: {
      frames: [0, 2, 4, 2],
      rate: 1 / 4
    },
    hit: {
      frames: [1],
      loop: false,
      rate: 1,
      next: "stand"
    },
    jump: {
      frames: [1],
      rate: 1
    }
  });

  Q.Sprite.extend("Player", {
    init: function(p) {
      this._super(p, {
        lifePoints: Q.state.get("lives"),
        timeInvincible: 0,
        timeToNextSave: 0,
        x: 0,
        y: 0,
        z: 100,
        savedPosition: {},
        hasKey: false,
        sheet: "player",
        sprite: "player",
        type: Game.SPRITE_PLAYER,
        collisionMask: Game.SPRITE_TILES | Game.SPRITE_ENEMY | Game.SPRITE_PLAYER_COLLECTIBLE
      });
      this.add("2d, platformerControls, animation");
      if (Q.state.get("hasGun")) {
        this.add("gun");
      }
      this.p.jumpSpeed = -660;
      this.p.speed = 330;
      this.p.savedPosition.x = this.p.x;
      this.p.savedPosition.y = this.p.y;
      Q.AudioManager.add(Game.audio.playerBg, {
        loop: true
      });
      this.on("bump.left, bump.right, bump.bottom, bump.top", this, "collision");
      return this.on("player.outOfMap", this, "restore");
    },
    step: function(dt) {
      if (this.p.direction === "left") {
        this.p.flip = "x";
        this.p.points = [[-15, -50], [25, -50], [25, 50], [-15, 50]];
      }
      if (this.p.direction === "right") {
        this.p.flip = false;
        this.p.points = [[-25, -50], [15, -50], [15, 50], [-25, 50]];
      }
      if (this.p.x > Game.map.p.w) {
        this.p.x = Game.map.p.w;
      }
      if (this.p.x < 0) {
        this.p.x = 0;
      }
      if (this.p.timeToNextSave > 0) {
        this.p.timeToNextSave = Math.max(this.p.timeToNextSave - dt, 0);
      }
      if (this.p.timeToNextSave === 0) {
        this.savePosition();
        this.p.timeToNextSave = 2;
      }
      if (this.p.timeInvincible > 0) {
        this.p.timeInvincible = Math.max(this.p.timeInvincible - dt, 0);
      }
      if (this.p.vy > 1100) {
        this.p.willBeDead = true;
      }
      if (this.p.willBeDead && this.p.vy < 1100) {
        this.updateLifePoints();
        this.p.willBeDead = false;
      }
      if (this.p.y > Game.map.p.h) {
        this.updateLifePoints();
        this.trigger("player.outOfMap");
        this.p.willBeDead = false;
      }
      if (this.p.vy !== 0) {
        this.play("jump");
      } else if (this.p.vx !== 0) {
        this.play("run");
      } else {
        this.play("stand");
      }
      if (this.gunStep != null) {
        return this.gunStep(dt);
      }
    },
    collision: function(col) {
      if (col.obj.isA("Zombie") && this.p.timeInvincible === 0) {
        this.updateLifePoints();
        col.obj.play("attack", 10);
        return this.p.timeInvincible = 1;
      }
    },
    savePosition: function() {
      var dirX, ground;
      dirX = this.p.vx / Math.abs(this.p.vx);
      ground = Q.stage().locate(this.p.x, this.p.y + this.p.h / 2 + 1, Game.SPRITE_TILES);
      if (ground) {
        this.p.savedPosition.x = this.p.x;
        return this.p.savedPosition.y = this.p.y;
      }
    },
    updateLifePoints: function(newLives) {
      var zombiePlayer,
        _this = this;
      if (newLives != null) {
        this.p.lifePoints += newLives;
      } else {
        this.p.lifePoints -= 1;
        Game.infoLabel.lifeLost();
        this.play("hit", 1);
        Q.AudioManager.add(Game.audio.playerHit);
        if (this.p.lifePoints <= 0) {
          Game.infoLabel.zombieModeOn();
          zombiePlayer = this.stage.insert(new Q.ZombiePlayer({
            x: (function() {
              if (_this.p.y > Game.map.p.h) {
                return _this.p.savedPosition.x;
              } else {
                return _this.p.x;
              }
            })(),
            y: (function() {
              if (_this.p.y > Game.map.p.h) {
                return _this.p.savedPosition.y;
              } else {
                return _this.p.y;
              }
            })()
          }));
          Game.setCameraTo(this.stage, zombiePlayer);
          this.destroy();
        }
        if (this.p.lifePoints === 1) {
          Game.infoLabel.lifeLevelLow();
        }
      }
      return Q.state.set("lives", this.p.lifePoints);
    },
    restore: function() {
      this.p.x = this.p.savedPosition.x;
      return this.p.y = this.p.savedPosition.y;
    }
  });

}).call(this);

(function() {
  var Q;

  Q = Game.Q;

  Q.animations("zombie", {
    stand: {
      frames: [4],
      rate: 1
    },
    run: {
      frames: [0, 4, 8, 12],
      rate: 0.4
    },
    hit: {
      frames: [13],
      loop: false,
      rate: 1,
      next: "run"
    },
    attack: {
      frames: [1, 5, 9, 13],
      loop: false,
      rate: 1 / 2,
      next: "run"
    },
    fall: {
      frames: [3, 7, 11, 15, 15, 15, 15],
      rate: 1 / 5,
      loop: false,
      next: "run"
    }
  });

  Q.Sprite.extend("Zombie", {
    init: function(p) {
      this._super(p, {
        lifePoints: 1,
        x: 0,
        y: 0,
        vx: 0,
        z: 20,
        sheet: "zombie",
        sprite: "zombie",
        canSeeThePlayerTimeout: 0,
        type: Game.SPRITE_ENEMY,
        collisionMask: Game.SPRITE_TILES | Game.SPRITE_PLAYER | Game.SPRITE_BULLET | Game.SPRITE_HUMAN
      });
      Q.state.inc("enemiesCounter", 1);
      this.add("2d, animation, zombieAI");
      this.on("hit", this, "collision");
      this.on("bump.right", this, "hitFromRight");
      return this.on("bump.left", this, "hitFromLeft");
    },
    collision: function(col) {
      if (col.obj.isA("Bullet")) {
        this.play("hit");
        return this.decreaseLifePoints();
      }
    },
    hitFromRight: function(col) {
      return this.p.vx = col.impact;
    },
    hitFromLeft: function(col) {
      return this.p.vx = -col.impact;
    },
    step: function(dt) {
      if (this.zombieStep != null) {
        this.zombieStep(dt);
      }
      if (this.p.y > Game.map.p.h) {
        this.die(false);
      }
      if (this.p.vy !== 0) {
        return this.play("fall");
      } else {
        return this.play("run");
      }
    },
    decreaseLifePoints: function() {
      this.p.lifePoints -= 1;
      if (this.p.lifePoints <= 0) {
        return this.die();
      }
    },
    die: function(turnToHuman) {
      if (turnToHuman == null) {
        turnToHuman = true;
      }
      this.destroy();
      if (!this.p.wasHuman && turnToHuman) {
        this.stage.insert(new Q.Human({
          x: this.p.x,
          y: this.p.y
        }));
      }
      return Q.state.dec("enemiesCounter", 1);
    }
  });

}).call(this);

(function() {
  var Q;

  Q = Game.Q;

  Q.animations("zombiePlayer", {
    stand: {
      frames: [1],
      rate: 1
    },
    run: {
      frames: [0, 1, 2, 3],
      rate: 1 / 3
    },
    jump: {
      frames: [0],
      rate: 1
    }
  });

  Q.Sprite.extend("ZombiePlayer", {
    init: function(p) {
      this._super(p, {
        timeToNextSave: 0,
        x: 0,
        y: 0,
        z: 100,
        savedPosition: {},
        sheet: "zombie_player",
        sprite: "zombiePlayer",
        type: Game.SPRITE_ZOMBIE_PLAYER,
        collisionMask: Game.SPRITE_TILES | Game.SPRITE_PLAYER_COLLECTIBLE
      });
      this.add("2d, platformerControls, animation");
      this.p.jumpSpeed = -500;
      this.p.speed = 140;
      this.p.savedPosition.x = this.p.x;
      this.p.savedPosition.y = this.p.y;
      Game.infoLabel.zombieModeOnNext();
      Q.AudioManager.remove(Game.audio.playerBg);
      Q.AudioManager.add(Game.audio.zombieMode, {
        loop: true
      });
      return this.on("player.outOfMap", this, "die");
    },
    step: function(dt) {
      if (this.p.direction === "left") {
        this.p.flip = "x";
      }
      if (this.p.direction === "right") {
        this.p.flip = false;
      }
      if (this.p.y > Game.map.p.h) {
        this.trigger("player.outOfMap");
      }
      if (this.p.x > Game.map.p.w) {
        this.p.x = Game.map.p.w;
      }
      if (this.p.x < 0) {
        this.p.x = 0;
      }
      if (this.p.timeToNextSave > 0) {
        this.p.timeToNextSave = Math.max(this.p.timeToNextSave - dt, 0);
      }
      if (this.p.timeToNextSave === 0) {
        this.savePosition();
        this.p.timeToNextSave = 4;
      }
      if (this.p.vy !== 0) {
        return this.play("jump");
      } else if (this.p.vx !== 0) {
        return this.play("run");
      } else {
        return this.play("stand");
      }
    },
    savePosition: function() {
      var dirX, ground;
      dirX = this.p.vx / Math.abs(this.p.vx);
      ground = Q.stage().locate(this.p.x, this.p.y + this.p.h / 2 + 1, Game.SPRITE_TILES);
      if (ground) {
        this.p.savedPosition.x = this.p.x;
        return this.p.savedPosition.y = this.p.y;
      }
    },
    die: function() {
      var player;
      Q.state.set("lives", 3);
      Game.player = player = this.stage.insert(new Q.Player({
        x: this.p.savedPosition.x,
        y: this.p.savedPosition.y
      }));
      Game.setCameraTo(this.stage, player);
      Game.infoLabel.zombieModeOff();
      Q.AudioManager.remove(Game.audio.zombieMode);
      return this.destroy();
    }
  });

}).call(this);

(function() {
  var Q;

  Q = Game.Q;

  Q.Sprite.extend("Door", {
    init: function(p) {
      this._super(p, {
        x: 0,
        y: 0,
        z: 10,
        sheet: "door_closed",
        opened: false,
        type: Game.SPRITE_PLAYER_COLLECTIBLE,
        sensor: true
      });
      return this.on("sensor", this, "sensor");
    },
    sensor: function(obj) {
      if (obj.isA("Player")) {
        if ((Q.state.get("hasKey")) && !this.p.opened) {
          Q.state.set("hasKey", false);
          this.p.opened = true;
          this.p.sheet = "door_open";
          return Game.infoLabel.doorOpen();
        } else if (!this.p.opened) {
          return Game.infoLabel.keyNeeded();
        } else if (this.p.opened && (Q.inputs['up'] || Q.inputs['action'])) {
          obj.destroy();
          return Game.stageEndLevelScreen();
        }
      }
    }
  });

}).call(this);

(function() {
  var Q;

  Q = Game.Q;

  Q.Sprite.extend("ExitSign", {
    init: function(p) {
      return this._super(p, {
        x: 0,
        y: 0,
        z: 10,
        sheet: "exit_sign",
        type: Game.SPRITE_NONE
      });
    }
  });

}).call(this);

(function() {
  var Q;

  Q = Game.Q;

  Q.Sprite.extend("Gun", {
    init: function(p) {
      this._super(p, {
        x: 0,
        y: 0,
        z: 10,
        sheet: "gun",
        type: Game.SPRITE_PLAYER_COLLECTIBLE,
        sensor: true
      });
      return this.on("sensor", this, "sensor");
    },
    sensor: function(obj) {
      if (obj.isA("Player")) {
        Q.state.set("hasGun", true);
        obj.add("gun");
        Game.infoLabel.gunFound();
        Q.AudioManager.add(Game.audio.collected);
        return this.destroy();
      }
    }
  });

}).call(this);

(function() {
  var Q;

  Q = Game.Q;

  Q.Sprite.extend("Heart", {
    init: function(p) {
      this._super(p, {
        x: 0,
        y: 0,
        z: 10,
        sheet: "heart",
        type: Game.SPRITE_PLAYER_COLLECTIBLE,
        sensor: true
      });
      return this.on("sensor", this, "sensor");
    },
    sensor: function(obj) {
      if (obj.isA("Player")) {
        obj.updateLifePoints(1);
        Game.infoLabel.extraLifeFound();
        Q.AudioManager.add(Game.audio.collected);
        return this.destroy();
      }
    }
  });

}).call(this);

(function() {
  var Q;

  Q = Game.Q;

  Q.Sprite.extend("Key", {
    init: function(p) {
      this._super(p, {
        x: 0,
        y: 0,
        z: 10,
        sheet: "key",
        type: Game.SPRITE_PLAYER_COLLECTIBLE,
        sensor: true
      });
      return this.on("sensor", this, "sensor");
    },
    sensor: function(obj) {
      if (obj.isA("Player")) {
        Q.state.set("hasKey", true);
        Game.infoLabel.keyFound();
        Q.AudioManager.add(Game.audio.collected);
        return this.destroy();
      }
    }
  });

}).call(this);

(function() {
  var Q;

  Q = Game.Q;

  Q.UI.AudioButton = Q.UI.Button.extend("UI.AudioButton", {
    init: function(p) {
      var _this = this;
      this._super(p, {
        x: 0,
        y: 80,
        w: 120,
        h: 60,
        type: Q.SPRITE_UI | Q.SPRITE_DEFAULT,
        fill: "#CCCCCC",
        label: "Sound on",
        keyActionName: "mute"
      });
      Game.isMuted = false;
      return this.on('click', function() {
        if (!Game.isMuted) {
          Q.AudioManager.mute();
          _this.p.label = "Sound off";
          return Game.isMuted = true;
        } else {
          Q.AudioManager.unmute();
          _this.p.label = "Sound on";
          return Game.isMuted = false;
        }
      });
    }
  });

}).call(this);

(function() {
  var Q;

  Q = Game.Q;

  Q.UI.BulletsCounter = Q.UI.Text.extend("UI.BulletsCounter", {
    init: function(p) {
      this._super(p, {
        text: "Bullets: ",
        label: "Bullets: " + Q.state.get("bullets"),
        size: 30,
        family: "Ubuntu",
        x: 0,
        y: 30,
        color: "#000"
      });
      return Q.state.on("change.bullets", this, "updateLabel");
    },
    updateLabel: function(bullets) {
      return this.p.label = this.p.text + bullets;
    }
  });

}).call(this);

(function() {
  var Q;

  Q = Game.Q;

  Q.UI.EnemiesCounter = Q.UI.Text.extend("UI.EnemiesCounter", {
    init: function(p) {
      this._super(p, {
        text: "Zombies left: ",
        label: "Zombies left: " + Q.state.get("enemiesCounter"),
        size: 30,
        x: 0,
        y: 0,
        color: "#000"
      });
      return Q.state.on("change.enemiesCounter", this, "updateLabel");
    },
    updateLabel: function(enemiesCounter) {
      return this.p.label = this.p.text + enemiesCounter;
    }
  });

}).call(this);

(function() {
  var Q;

  Q = Game.Q;

  Q.UI.InfoLabel = Q.UI.Text.extend("UI.InfoLabel", {
    init: function(p, defaultProps) {
      return this._super(p, {
        label: "",
        color: "#000",
        x: 100,
        y: 0,
        size: 28
      });
    },
    intro: function() {
      return this.p.label = "I need to find the way out of here";
    },
    keyNeeded: function() {
      return this.p.label = "I need the key";
    },
    doorOpen: function() {
      return this.p.label = "Nice! Now I need to 'jump' inside the door";
    },
    gunFound: function() {
      return this.p.label = "I found the gun, I can shoot pressing Z";
    },
    outOfBullets: function() {
      return this.p.label = "I'm out of ammo";
    },
    keyFound: function() {
      return this.p.label = "I found the key, now I need to find the the door";
    },
    clear: function() {
      return this.p.label = "";
    },
    lifeLevelLow: function() {
      return this.p.label = "I need to be more careful";
    },
    extraLifeFound: function() {
      return this.p.label = "I feel better now!";
    },
    lifeLost: function() {
      return this.p.label = "That hurts!";
    },
    zombieModeOn: function() {
      return this.p.label = "I was bitten. I'm turning. Nooo!";
    },
    zombieModeOnNext: function() {
      return this.p.label = "I need to kill myself";
    },
    zombieModeOff: function() {
      return this.p.label = "Ok, back to businness";
    }
  });

}).call(this);

(function() {
  var Q;

  Q = Game.Q;

  Q.UI.LevelButton = Q.UI.Button.extend("UI.LevelButton", {
    init: function(p) {
      var _this = this;
      this._super(p, {
        type: Q.SPRITE_UI | Q.SPRITE_DEFAULT,
        fill: "#EEE"
      });
      this.p.label = this.p.level;
      if (this.p.enabled === false) {
        this.p.fill = "#CCC";
      }
      return this.on('click', function() {
        if (_this.p.enabled) {
          return Game.stageLevel(_this.p.level);
        }
      });
    }
  });

}).call(this);

(function() {
  var Q;

  Q = Game.Q;

  Q.UI.LivesCounter = Q.UI.Text.extend("UI.LivesCounter", {
    init: function(p) {
      this._super(p, {
        text: "Health: ",
        label: "Health: " + Q.state.get("lives"),
        size: 30,
        x: 0,
        y: 0,
        color: "#000"
      });
      return Q.state.on("change.lives", this, "updateLabel");
    },
    updateLabel: function(lives) {
      return this.p.label = this.p.text + lives;
    }
  });

}).call(this);

(function() {
  var Q;

  Q = Game.Q;

  Q.UI.PauseButton = Q.UI.Button.extend("UI.PauseButton", {
    init: function(p) {
      var _this = this;
      this._super(p, {
        x: 0,
        y: 0,
        w: 120,
        h: 60,
        type: Q.SPRITE_UI | Q.SPRITE_DEFAULT,
        fill: "#CCCCCC",
        label: "Pause",
        isPaused: false,
        keyActionName: "pause"
      });
      this.pausedScreen = new Q.UI.Container({
        x: Q.width / 2,
        y: Q.height / 2,
        w: Q.width,
        h: Q.height,
        fill: "rgba(0,0,0,0.5)"
      });
      return this.on('click', function() {
        if (!_this.isPaused) {
          Q.stage().pause();
          Q.AudioManager.stopAll();
          _this.p.label = "Unpause";
          _this.isPaused = true;
          return _this.stage.insert(_this.pausedScreen);
        } else {
          Q.stage().unpause();
          if (!Game.isMuted) {
            Q.AudioManager.playAll();
          }
          _this.p.label = "Pause";
          _this.isPaused = false;
          return _this.stage.remove(_this.pausedScreen);
        }
      });
    }
  });

}).call(this);
