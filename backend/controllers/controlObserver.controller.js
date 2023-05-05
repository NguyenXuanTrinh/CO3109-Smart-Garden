const { checkThreshold } = require('./checkThreshold')
const { autoPump } = require('./autoPump')
const Observable = require('./Observer')

exports.controlAutoPump = (req,res) => {
    const value = req.params['value'];
    if(value === '1'){
        Observable.subscribe(autoPump)
        console.log("subscribe")
    }
    else if(value === '0'){
        Observable.unsubscribe(autoPump);
        console.log("unsubscribe")
    }
    res.send("OK")
  }

exports.controlCheckThreshold = (req,res) => {
    const value = req.params['value']
    if(value === '1'){
        Observable.subscribe(checkThreshold)
    }
    else if(value === '0'){
        Observable.unsubscribe(checkThreshold);
    }
    res.send("OK")
}