# main game object
window.Game =
  init: ->
    # engine instance
    @Q = Q = Quintus
      development: true

    # Q.debug = true
    # Q.debugFill = true

    # main setup
    Q.include "Sprites, Scenes, Input, Touch, UI, 2D, Anim"
    Q.setup
      width: 640
      height: 320
      maximize: true
      upsampleWidth: 640
      upsampleHeight: 320
    Q.controls().touch() # add true for joypad

    # used for collision detection
    @SPRITE_NONE = 0
    @SPRITE_PLAYER = 1
    @SPRITE_TILES = 2
    @SPRITE_ENEMY = 4
    @SPRITE_BULLET = 8
    @SPRITE_PLAYER_COLLECTIBLE = 16
    @SPRITE_ALL = 0xFFFF

    # rest of init
    @prepareAssets()
    @initStats()

    # helpers
    Q.tilePos = (col, row, otherParams = {}) ->
      position =
        x: col * Game.assets.map.tileSize + Game.assets.map.tileSize/2
        y: row * Game.assets.map.tileSize + Game.assets.map.tileSize/2

      Q._extend position, otherParams

    return

  # one place of defining assets
  prepareAssets: ->
    # all assets, only file names
    @assets =
      player:
        dataAsset: "player.json"
        sheet: "player.png"
      map:
        dataAsset: "map.tmx"
        sheet: "map_tiles.png"
        bg: "bg.jpg"
      enemies:
        dataAsset: "enemies.json"
        sheet: "enemies.png"
      items:
        dataAsset: "items.json"
        sheet: "items.png"


    # convert to array for Q.load
    assetsAsArray = []
    @objValueToArray(@assets, assetsAsArray)

    # now we can add metadata
    @assets.map.sheetName = "tiles"
    @assets.all = assetsAsArray
    @assets.map.tileSize = 50

  # helper to conver obj to array
  objValueToArray: (obj, array) ->
    for key, value of obj
      if typeof value == 'string'
        array.push value
      else
        @objValueToArray(value, array)

  initStats: ->
    @Q.stats = stats = new Stats()
    stats.setMode(0) # 0: fps, 1: ms

    # Align top-left
    stats.domElement.style.position = 'absolute'
    stats.domElement.style.left = '0px'
    stats.domElement.style.top = '40px'

    document.body.appendChild( stats.domElement )

  stageLevel: ->
    @Q.state.reset
      enemiesCounter: 0
      lives: 0

    @Q.clearStages()
    @Q.stageScene "level1",
      sort: true
    @Q.stageScene "stats", 1

    # the story
    Game.infoLabel.intro()



# init game
Game.init()
