Q = Game.Q

# animations object
Q.animations "human",
  stand:
    frames: [4]
    rate: 1/2
  run:
    frames: [4, 5, 6]
    rate: 1/4
  hit:
    frames: [0]
    loop: false
    rate: 1/2
    next: "stand"
  jump:
    frames: [2]
    rate: 1/2

Q.component "humanAI",
  added: ->
    p = @entity.p

    p.sheet = "player"
    p.sprite = "human"
    p.vx = 0

    Q._generatePoints(@entity)
    Q._generateCollisionPoints(@entity)


    # animations
    @entity.play "stand"

