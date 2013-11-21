Q = Game.Q

Q.load Game.assets.all,
  ->
    # prepare sheets
    Q.sheet Game.assets.map.sheetName, Game.assets.map.sheet,
      tileW: Game.assets.map.tileSize
      tileH: Game.assets.map.tileSize

    Q.compileSheets Game.assets.player.sheet, Game.assets.player.dataAsset
    Q.compileSheets Game.assets.enemies.sheet, Game.assets.enemies.dataAsset
    Q.compileSheets Game.assets.items.sheet, Game.assets.items.dataAsset
    Q.compileSheets Game.assets.zombie.sheet, Game.assets.zombie.dataAsset

    # start the stage
    Game.stageLevel()
    # Q.stageScene "start", 2
  , {
    progressCallback: (loaded, total) ->
      element = document.getElementById("loading-progress")
      element.style.width = Math.floor(loaded/total*100) + "%"

      if loaded == total
        container = document.getElementById("loading")
        container.parentNode.removeChild(container)
  }

