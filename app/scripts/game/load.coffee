Q = Game.Q

Q.load Game.assets.all, ->
  # prepare sheets
  Q.sheet Game.assets.map.sheetName, Game.assets.map.sheet,
    tileW: Game.assets.map.tileSize
    tileH: Game.assets.map.tileSize

  Q.compileSheets Game.assets.player.sheet, Game.assets.player.dataAsset
  Q.compileSheets Game.assets.enemies.sheet, Game.assets.enemies.dataAsset
  Q.compileSheets Game.assets.items.sheet, Game.assets.items.dataAsset

  # start the stage
  Game.stageLevel()
  # Q.stageScene "start", 2
