Q = Game.Q

Q.AudioManager =
  collection: []
  muted: false

  add: (audio, options) ->
    item =
      audio: audio
      options: options

    if options?.loop == true
      @collection.push item

    if !@muted
      Q.audio.play item.audio, item.options

  remove: (audio) ->
    indexToRemove = null

    for item, index in @collection
      if item.audio == audio
        indexToRemove = index
        Q.audio.stop(item.audio)

    @collection.splice(indexToRemove, 1)

  playAll: ->
    for item in @collection
      Q.audio.play item.audio, item.options

  stopAll: ->
    Q.audio.stop()

  mute: ->
    @muted = true
    @stopAll()

  unmute: ->
    @muted = false
    @playAll()
