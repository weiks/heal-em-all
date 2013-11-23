# main game object
window.Game =
  init: ->
    # engine instance
    @Q = Q = Quintus
      development: true
      audioSupported: [ 'ogg', 'mp3' ]

    # Q.debug = true
    # Q.debugFill = true

    # main setup
    Q.include "Sprites, Scenes, Input, Touch, UI, 2D, Anim, Audio"
    Q.setup
      width: 640
      height: 320
      maximize: true
      upsampleWidth: 640
      upsampleHeight: 320
    Q.controls().touch() # add true for joypad
    Q.enableSound();

    # used for collision detection
    @SPRITE_NONE = 0
    @SPRITE_PLAYER = 1
    @SPRITE_TILES = 2
    @SPRITE_ENEMY = 4
    @SPRITE_BULLET = 8
    @SPRITE_PLAYER_COLLECTIBLE = 16
    @SPRITE_HUMAN = 32
    @SPRITE_ZOMBIE_PLAYER = 64
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
      zombie:
        dataAsset: "zombie.json"
        sheet: "zombie.png"
      human:
        dataAsset: "human.json"
        sheet: "human.png"
      items:
        dataAsset: "items.json"
        sheet: "items.png"
      map:
        sheet: "map_tiles.png"
        bg: "bg.png"
      level1:
        dataAsset: "level1.tmx"
      level2:
        dataAsset: "level2.tmx"

    @audio =
      zombieMode: "zombie_mode.mp3"
      playerBg: "player_bg.mp3"
      zombieNotice: "zombie_notice.mp3"

    # convert to array for Q.load
    assetsAsArray = []
    @objValueToArray(@assets, assetsAsArray)

    # now we can add metadata
    @assets.map.sheetName = "tiles"
    @assets.map.tileSize = 70

    # convert @audio to array
    audioAsArray = []
    @objValueToArray(@audio, audioAsArray)

    # merge assets and audio for Q.load
    @assets.all = assetsAsArray.concat(audioAsArray)

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
      bullets: 0

    @Q.clearStages()
    @Q.stageScene "level1",
      sort: true
    @Q.stageScene "stats", 1

    # the story
    Game.infoLabel.intro()

  setCameraTo: (stage, toFollowObj) ->
    stage.follow toFollowObj,
      x: true
      y: true
    ,
      minX: 0
      maxX: Game.map.p.w
      minY: 0
      maxY: Game.map.p.h


# init game
Game.init()
