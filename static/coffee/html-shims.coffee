#========================================
#HTML shims
#========================================
#requestAnimFrame - support for webkitRequestAnimationFrame
window.requestAnimFrame = (()->
    return window.requestAnimationFrame or window.webkitRequestAnimationFrame or window.mozRequestAnimationFrame or window.oRequestAnimationFrame or window.msRequestAnimationFrame or (callback)->
        window.setTimeout(callback, 1000 / 60)
)()
