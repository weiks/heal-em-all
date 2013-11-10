Q = Game.Q

Q.scene "level1", (stage) ->

  # main map with collision
  Game.map = map = new Q.TileLayer
    type: Game.SPRITE_TILES
    layerIndex: 0
    dataAsset: Game.assets.map.dataAsset
    sheet: Game.assets.map.sheetName
    tileW: Game.assets.map.tileSize
    tileH: Game.assets.map.tileSize

  stage.collisionLayer map

  # decorations
  background = new Q.TileLayer
    layerIndex: 1,
    type: Game.SPRITE_NONE
    dataAsset: Game.assets.map.dataAsset
    sheet: Game.assets.map.sheetName
    tileW: Game.assets.map.tileSize
    tileH: Game.assets.map.tileSize

  stage.insert background

  # player
  Game.player = player = stage.insert new Q.Player(Q.tilePos(49.5, 21))

  # camera
  stage.add("viewport")
  stage.follow player,
    x: true
    y: true
  ,
    minX: 0
    maxX: map.p.w
    minY: 0
    maxY: map.p.h

  # enemies by columns
  enemies = [

    ["Enemy", Q.tilePos(39, 9, {sheet: "zombie4"})]
    ["Enemy", Q.tilePos(39, 15, {vx: 100, sheet: "zombie5"})]
    ["Enemy", Q.tilePos(39, 21, {sheet: "zombie3"})]
    ["Enemy", Q.tilePos(39, 27, {vx: 100, sheet: "zombie2"})]
    ["Enemy", Q.tilePos(39, 33, {sheet: "zombie1"})]

    ["Enemy", Q.tilePos(49, 9, {sheet: "zombie3"})]
    ["Enemy", Q.tilePos(49, 15, {sheet: "zombie2"})]
    ["Enemy", Q.tilePos(49, 27, {vx: 100})]
    ["Enemy", Q.tilePos(49, 33, {sheet: "zombie4"})]

    ["Enemy", Q.tilePos(60, 9, {vx: 100, sheet: "zombie5"})]
    ["Enemy", Q.tilePos(60, 15, {sheet: "zombie1"})]
    ["Enemy", Q.tilePos(60, 21, {vx: 100, sheet: "zombie4"})]
    ["Enemy", Q.tilePos(60, 27, {sheet: "zombie3"})]
    ["Enemy", Q.tilePos(60, 33, {vx: 100, sheet: "zombie2"})]

  ]

  stage.loadAssets(enemies)
