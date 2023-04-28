const { createNotification } = require('./notification.controller')
const { getThresholdById, getDevicesByID } = require('./device.controller')
const { getGardenPName } = require('./garden_piece.controller')
const axios = require('axios')

module.exports.checkThreshold = async (context) => {
    if (context['record']) {
        const dt = context['record']
        const io = context['io']
        const newValue = context['new-value']

        const device = await getDevicesByID(dt.id)
        const gardenName = await getGardenPName(device.garPiece)
        const {min, max} = await getThresholdById(dt.id)
        if (newValue.value < min || newValue.value > max) {
          this.turnLight("ON")
          const threshold = newValue.value < min ? min : max;
          const type = dt.type === 'air' ? "Air Humidity"
                  : dt.type === 'temp' ? "Temperature" 
                  : "Soil Humidity";
          await createNotification(type, dt.owner, false, newValue.value, threshold, newValue.log_time, gardenName, device.coordinates.x, device.coordinates.y)
          if (io.sockets.adapter.rooms.has(`notify-${dt.owner}`)) {
            io.to(`notify-${dt.owner}`).emit('newNotify')
          }
        }
        else{
          this.turnLight("OFF")
        }
    }
}

exports.turnLight = (value) => {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'JWT fefege...',
    'X-AIO-Key':'aio_Ewca52MVCwTlWYt8ykAtCVaVEj2e'
  }
  const data2 = {
    "datum":
    {
      "value":value
    }
  }
  axios.post('https://io.adafruit.com/api/v2/hongphat03/feeds/led-canh-bao/data', data2, {
      headers: headers
    })
    .then((response) => {
      // console.log("OK")
    })
    .catch((error) => {
      console.log(error)
    })

}

