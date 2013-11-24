Q = Game.Q

Q.scene "level2", (stage) ->

  # main map with collision
  Game.map = map = new Q.TileLayer
    type: Game.SPRITE_TILES
    layerIndex: 0
    dataAsset: Game.assets.level2.dataAsset
    sheet: Game.assets.map.sheetName
    tileW: Game.assets.map.tileSize
    tileH: Game.assets.map.tileSize
    z: 2

  stage.collisionLayer map

  # decorations
  background = new Q.TileLayer
    layerIndex: 1,
    type: Game.SPRITE_NONE
    dataAsset: Game.assets.level2.dataAsset
    sheet: Game.assets.map.sheetName
    tileW: Game.assets.map.tileSize
    tileH: Game.assets.map.tileSize
    z: 1

  stage.insert background

  # player
  Game.player = player = stage.insert new Q.Player(Q.tilePos(2.5, 9))

  # camera
  stage.add("viewport")
  Game.setCameraTo(stage, player)

  # enemies
  enemies = [
    ["Zombie", Q.tilePos(9, 6)]
    ["Zombie", Q.tilePos(8, 12, {startLeft: true})]
    ["Zombie", Q.tilePos(20, 6, {startLeft: true})]
    ["Zombie", Q.tilePos(21, 12)]
  ]

  stage.loadAssets(enemies)

  # items
  items = [
    ["Key", Q.tilePos(14.5, 3)]
    ["Door", Q.tilePos(27, 9)]
    ["ExitSign", Q.tilePos(26, 9)]
    ["Gun", Q.tilePos(14.5, 9)]
    ["Heart", Q.tilePos(14.5, 15)]
  ]

  stage.loadAssets(items)

