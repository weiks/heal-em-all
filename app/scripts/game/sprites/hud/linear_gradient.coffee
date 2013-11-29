Q = Game.Q

Q.UI.LinearGradient = Q.Sprite.extend "Q.UI.LinearGradient",
  init: (p) ->
    @_super p,
      x: Q.width/2
      y: Q.height/2
      w: Q.width
      h: Q.height
      z: 0
      asset: Game.assets.gradient
