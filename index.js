module.exports = function pepega(dispatch) {
    const config = require('./config.json')
    let enabled = true
    let divisor = config.divisor
    let gameId = 0;
    let damageType = [0, 1, 2]


    dispatch.command.add('short', (x) => {
        let new_divisor = parseInt(x);
        if (isNaN(new_divisor)) {
            enabled = !enabled
            dispatch.command.message('shorten damage numbers ' + (enabled ? 'enabled' : 'disabled'))
            return
        }
        divisor = x;
        dispatch.command.message('divisor is set to ' + x)
    })

    dispatch.hook('S_LOGIN', 14, e => {
            gameId = e.gameId
        }
    )

    dispatch.hook('S_EACH_SKILL_RESULT', 14, {order: 100}, event => {
        if (!enabled) return;
        if ((gameId == event.source || gameId == event.owner) && event.type in damageType) {
            let shortened = event.value / BigInt(divisor)
            if (shortened < 1n) {
                shortened = 1n
            }
            event.value = shortened
            return true
        }
    })
}