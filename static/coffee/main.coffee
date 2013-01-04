#========================================
#shim for requestAnimFrame
#========================================
if window
    window.requestAnimFrame = (()->
        return window.requestAnimationFrame or window.webkitRequestAnimationFrame or window.mozRequestAnimationFrame or window.oRequestAnimationFrame or window.msRequestAnimationFrame or (callback)->
            window.setTimeout(callback, 1000 / 60)
    )()
else
    #Need to set window to some var for variable hoisting so `if window` doesn't
    #blow up
    window = {}

#========================================
#init
#========================================
init = ()->
    game = new GAME.Models.World()
    gameView = new GAME.Views.World({
        model: game
    })

    gameView.render()

window.onload = init

root = exports ? window
root.GAME = GAME
