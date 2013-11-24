Q = Game.Q

Q.scene "level3", (stage) ->

  # main map with collision
  Game.map = map = new Q.TileLayer
    type: Game.SPRITE_TILES
    layerIndex: 0
    dataAsset: Game.assets.level3.dataAsset
    sheet: Game.assets.map.sheetName
    tileW: Game.assets.map.tileSize
    tileH: Game.assets.map.tileSize
    z: 2

  stage.collisionLayer map

  # decorations
  background = new Q.TileLayer
    layerIndex: 1,
    type: Game.SPRITE_NONE
    dataAsset: Game.assets.level3.dataAsset
    sheet: Game.assets.map.sheetName
    tileW: Game.assets.map.tileSize
    tileH: Game.assets.map.tileSize
    z: 1

  stage.insert background

  # player
  Game.player = player = stage.insert new Q.Player(Q.tilePos(24.5, 14))

  # camera
  stage.add("viewport")
  Game.setCameraTo(stage, player)

  # enemies
  enemies = [
    ["Zombie", Q.tilePos(8, 11)]
    ["Zombie", Q.tilePos(9, 17, {startLeft: true})]

    ["Zombie", Q.tilePos(18, 6)]
    ["Zombie", Q.tilePos(19, 23)]

    ["Zombie", Q.tilePos(31, 6)]
    ["Zombie", Q.tilePos(30, 23)]

    ["Zombie", Q.tilePos(41, 11)]
    ["Zombie", Q.tilePos(42, 17, {startLeft: true})]
  ]

  stage.loadAssets(enemies)

  # items
  randomItems = [
    door: Q.tilePos(47, 14)
    exitSign: Q.tilePos(46, 14)
    key: Q.tilePos(2.5, 14)
  ,
    door: Q.tilePos(2, 14)
    exitSign: Q.tilePos(3, 14)
    key: Q.tilePos(46.5, 14)
  ]

  random = Math.floor(Math.random() * 2)

  items = [
    ["Key", randomItems[random].key]
    ["Door", randomItems[random].door]
    ["ExitSign", randomItems[random].exitSign]
    ["Gun", Q.tilePos(24.5, 3)]
    ["Heart", Q.tilePos(8, 6)]
    ["Heart", Q.tilePos(41.5, 6)]
    ["Heart", Q.tilePos(24.5, 26)]
  ]

  stage.loadAssets(items)

