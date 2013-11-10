(function() {
  window.Game = {
    init: function() {
      var Q;
      this.Q = Q = Quintus({
        development: true
      });
      Q.include("Sprites, Scenes, Input, Touch, UI, 2D, Anim");
      Q.setup({
        width: 640,
        height: 320,
        maximize: true,
        upsampleWidth: 640,
        upsampleHeight: 320
      });
      Q.controls().touch();
      this.SPRITE_NONE = 0;
      this.SPRITE_PLAYER = 1;
      this.SPRITE_TILES = 2;
      this.SPRITE_ENEMY = 4;
      this.SPRITE_BULLET = 8;
      this.SPRITE_PLAYER_COLLECTIBLE = 16;
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
      var assetsAsArray;
      this.assets = {
        player: {
          dataAsset: "player.json",
          sheet: "player.png"
        },
        map: {
          dataAsset: "map_v3.tmx",
          sheet: "map_tiles.png"
        },
        enemies: {
          dataAsset: "enemies.json",
          sheet: "enemies.png"
        }
      };
      assetsAsArray = [];
      this.objValueToArray(this.assets, assetsAsArray);
      this.assets.map.sheetName = "tiles";
      this.assets.all = assetsAsArray;
      return this.assets.map.tileSize = 50;
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
    stageLevel: function() {
      this.Q.state.reset({
        enemiesCounter: 0,
        lives: 0
      });
      this.Q.clearStages();
      this.Q.stageScene("level1", {
        sort: true
      });
      this.Q.stageScene("stats", 1);
      return Game.infoLabel.intro();
    }
  };

  Game.init();

}).call(this);

(function() {
  var Q;

  Q = Game.Q;

  Q.component("gun", {
    added: function() {
      return Q.input.on("fire", this.entity, "fireGun");
    },
    extend: {
      fireGun: function() {
        var bullet;
        return bullet = this.stage.insert(new Q.Bullet({
          x: this.p.x,
          y: this.p.y,
          direction: this.p.direction
        }));
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
    Q.compileSheets(Game.assets.player.sheet, Game.assets.player.dataAsset);
    Q.compileSheets(Game.assets.enemies.sheet, Game.assets.enemies.dataAsset);
    return Game.stageLevel();
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
      label: "Play Again",
      keyActionName: "confirm"
    }));
    label = container.insert(new Q.UI.Text({
      x: 10,
      y: -10 - button.p.h,
      label: stage.options.label
    }));
    button.on("click", function(e) {
      return Game.stageLevel();
    });
    return container.fit(20);
  });

}).call(this);

(function() {
  var Q;

  Q = Game.Q;

  Q.scene("level1", function(stage) {
    var background, enemies, map, player;
    Game.map = map = new Q.TileLayer({
      type: Game.SPRITE_TILES,
      layerIndex: 0,
      dataAsset: Game.assets.map.dataAsset,
      sheet: Game.assets.map.sheetName,
      tileW: Game.assets.map.tileSize,
      tileH: Game.assets.map.tileSize
    });
    stage.collisionLayer(map);
    background = new Q.TileLayer({
      layerIndex: 1,
      type: Game.SPRITE_NONE,
      dataAsset: Game.assets.map.dataAsset,
      sheet: Game.assets.map.sheetName,
      tileW: Game.assets.map.tileSize,
      tileH: Game.assets.map.tileSize
    });
    stage.insert(background);
    Game.player = player = stage.insert(new Q.Player(Q.tilePos(49.5, 21)));
    stage.add("viewport");
    stage.follow(player, {
      x: true,
      y: true
    }, {
      minX: 0,
      maxX: map.p.w,
      minY: 0,
      maxY: map.p.h
    });
    enemies = [
      [
        "Enemy", Q.tilePos(39, 9, {
          sheet: "zombie4"
        })
      ], [
        "Enemy", Q.tilePos(39, 15, {
          vx: 100,
          sheet: "zombie5"
        })
      ], [
        "Enemy", Q.tilePos(39, 21, {
          sheet: "zombie3"
        })
      ], [
        "Enemy", Q.tilePos(39, 27, {
          vx: 100,
          sheet: "zombie2"
        })
      ], [
        "Enemy", Q.tilePos(39, 33, {
          sheet: "zombie1"
        })
      ], [
        "Enemy", Q.tilePos(49, 9, {
          sheet: "zombie3"
        })
      ], [
        "Enemy", Q.tilePos(49, 15, {
          sheet: "zombie2"
        })
      ], [
        "Enemy", Q.tilePos(49, 27, {
          vx: 100
        })
      ], [
        "Enemy", Q.tilePos(49, 33, {
          sheet: "zombie4"
        })
      ], [
        "Enemy", Q.tilePos(60, 9, {
          vx: 100,
          sheet: "zombie5"
        })
      ], [
        "Enemy", Q.tilePos(60, 15, {
          sheet: "zombie1"
        })
      ], [
        "Enemy", Q.tilePos(60, 21, {
          vx: 100,
          sheet: "zombie4"
        })
      ], [
        "Enemy", Q.tilePos(60, 27, {
          sheet: "zombie3"
        })
      ], [
        "Enemy", Q.tilePos(60, 33, {
          vx: 100,
          sheet: "zombie2"
        })
      ]
    ];
    return stage.loadAssets(enemies);
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
    var button, container, enemiesCounterLabel, isPaused, lifesLabel, pausedScreen;
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
    Game.infoLabel = new Q.UI.InfoLabel;
    container.insert(Game.infoLabel);
    button = container.insert(new Q.UI.Button({
      x: container.p.w / 2 - 40,
      y: 0,
      w: 80,
      fill: "#CCCCCC",
      label: "Pause",
      keyActionName: "pause"
    }));
    isPaused = false;
    pausedScreen = new Q.UI.Container({
      x: Q.width / 2,
      y: Q.height / 2,
      w: Q.width,
      h: Q.height,
      fill: "rgba(0,0,0,0.5)"
    });
    return button.on('click', function() {
      if (!isPaused) {
        Q.stage().pause();
        button.p.label = "Unpause";
        isPaused = true;
        return stage.insert(pausedScreen);
      } else {
        Q.stage().unpause();
        button.p.label = "Pause";
        isPaused = false;
        return stage.remove(pausedScreen);
      }
    });
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
        speed: 500,
        gravity: 1,
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

  Q.animations("enemy", {
    run: {
      frames: [4, 3, 2],
      rate: 1 / 4
    },
    hit: {
      frames: [0],
      loop: false,
      rate: 1 / 2,
      next: "run"
    }
  });

  Q.Sprite.extend("Enemy", {
    init: function(p) {
      this._super(p, {
        lifePoints: 1,
        x: 0,
        y: 0,
        vx: -100,
        z: 10,
        canSeeThePlayerTimeout: 0,
        sheet: "zombie1",
        sprite: "enemy",
        type: Game.SPRITE_ENEMY,
        collisionMask: Game.SPRITE_TILES | Game.SPRITE_PLAYER | Game.SPRITE_BULLET
      });
      Q.state.inc("enemiesCounter", 1);
      this.add("2d, animation");
      this.on("hit", this, "collision");
      this.on("bump.right", this, "hitFromRight");
      this.on("bump.left", this, "hitFromLeft");
      return this.play("run");
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
      var dirX, ground, nextTile;
      this.canSeeThePlayer();
      if (this.canSeeThePlayerObj.status) {
        this.p.canSeeThePlayerTimeout = 2;
        if ((this.canSeeThePlayerObj.left && this.p.vx > 0) || (this.canSeeThePlayerObj.right && this.p.vx < 0)) {
          this.p.vx = -this.p.vx;
        }
      } else {
        this.p.canSeeThePlayerTimeout = Math.max(this.p.canSeeThePlayerTimeout - dt, 0);
      }
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
        return this.p.flip = "x";
      } else {
        return this.p.flip = false;
      }
    },
    decreaseLifePoints: function() {
      this.p.lifePoints -= 1;
      if (this.p.lifePoints <= 0) {
        this.destroy();
        return Q.state.dec("enemiesCounter", 1);
      }
    },
    canSeeThePlayer: function() {
      var isCloseFromLeft, isCloseFromRight, isTheSameY, lineOfSight, player;
      player = Game.player.p;
      lineOfSight = 250;
      this.canSeeThePlayerObj = {};
      isTheSameY = player.y > this.p.y - 10 && player.y < this.p.y + 10;
      this.canSeeThePlayerObj.left = isCloseFromLeft = (player.x > this.p.x - lineOfSight) && player.x < this.p.x;
      this.canSeeThePlayerObj.right = isCloseFromRight = (player.x < this.p.x + lineOfSight) && player.x > this.p.x;
      if (isTheSameY && (isCloseFromLeft || isCloseFromRight)) {
        this.canSeeThePlayerObj.status = true;
      } else {
        this.canSeeThePlayerObj.status = false;
      }
    }
  });

}).call(this);

(function() {
  var Q;

  Q = Game.Q;

  Q.animations("player", {
    stand: {
      frames: [4],
      rate: 1 / 2
    },
    run: {
      frames: [4, 5, 6],
      rate: 1 / 4
    },
    hit: {
      frames: [0],
      loop: false,
      rate: 1 / 2,
      next: "stand"
    },
    jump: {
      frames: [2],
      rate: 1 / 2
    }
  });

  Q.Sprite.extend("Player", {
    init: function(p) {
      this._super(p, {
        lifePoints: 3,
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
      this.add("2d, platformerControls, animation, gun");
      this.p.jumpSpeed = -570;
      this.p.speed = 300;
      this.p.savedPosition.x = this.p.x;
      this.p.savedPosition.y = this.p.y;
      Q.state.set("lives", this.p.lifePoints);
      this.on("bump.left, bump.right, bump.bottom, bump.top", this, "collision");
      return this.on("player.outOfMap", this, "restore");
    },
    step: function(dt) {
      if (this.p.direction === "left") {
        this.p.flip = false;
      }
      if (this.p.direction === "right") {
        this.p.flip = "x";
      }
      if (this.p.y > Game.map.p.h) {
        this.p.y = 0;
      }
      if (this.p.x > Game.map.p.w) {
        this.p.x = 0;
      }
      if (this.p.x < 0) {
        this.p.x = Game.map.p.w;
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
      if (this.p.vy !== 0) {
        return this.play("jump");
      } else if (this.p.vx !== 0) {
        return this.play("run");
      } else {
        return this.play("stand");
      }
    },
    collision: function(col) {
      if (col.obj.isA("Enemy") && this.p.timeInvincible === 0) {
        this.updateLifePoints();
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
      if (newLives != null) {
        this.p.lifePoints += newLives;
      } else {
        this.p.lifePoints -= 1;
        Game.infoLabel.lifeLost();
        this.play("hit", 1);
        if (this.p.lifePoints <= 0) {
          this.destroy();
          Q.stageScene("end", 2, {
            label: "You Died"
          });
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
      return this.p.label = "I need to cure them";
    },
    clear: function() {
      return this.p.label = "";
    },
    lifeLevelLow: function() {
      return this.p.label = "I need to be more careful";
    },
    lifeLost: function() {
      return this.p.label = "That hurts!";
    }
  });

}).call(this);

(function() {
  var Q;

  Q = Game.Q;

  Q.UI.LivesCounter = Q.UI.Text.extend("UI.LivesCounter", {
    init: function(p) {
      this._super(p, {
        text: "Lives: ",
        label: "Lives: " + Q.state.get("lives"),
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
