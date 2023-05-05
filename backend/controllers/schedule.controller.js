const schedule = require('../models/schedule.model')
const controller = require('../models/controller.model')
const record = require('../models/record.model')

const axios = require('axios')

exports.postSchedule = (req, res) => {
    const scheduleList = req.body
    const dates = scheduleList.dates
    dates.map((date) => {
      const data = {
        ...scheduleList,
        dates:date.substring(0,10)
      }
      // insert nếu ngày đó chưa có trong db
      schedule.find({dates:data.dates, time:date.time})
      .then((sche) => {
        if(sche.length == 0){
          schedule.collection.insertOne(data)
        }
      })
    })
    // schedule.collection.remove({})
    // schedule.collection.deleteMany({})
    // schedule.collection.insertOne(data)
}


// send request turn on pump
exports.turnOn = (ctrl) => {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'JWT fefege...',
    'X-AIO-Key':'aio_aMbk25klg0NSmAZpEH9DuJ6wu4Sl'
  }
  const data2 = {
    "datum":
    {
      "value":"ON"
    }
  }
  axios.post('https://io.adafruit.com/api/v2/hongphat03/feeds/maybom/data', data2, {
      headers: headers
    })
    .then((response) => {
      // console.log("OK")
    })
    .catch((error) => {
      console.log(error)
    })

    record.collection.findOne(
      {
        type:'pump'
      }
    )
    .then((data) => {
      const index = data.valueList.length
      controller.collection.findOne(
        {
          type:"pump"
        }
      )
      .then((data) => {
        if(!data){
          controller.collection.insertOne({
            id: 5,
            type: "pump",
            controlList: [
            {
              index:index,
              controller: ctrl,
              value: "ON"
            }
            ]
          })
        }
        else{
          const list = data.controlList
          list.push({
            index:index,
            controller: ctrl,
            value: "ON"
          })
          controller.collection.updateOne({type:"pump"},{
            $set:{
              controlList:list
            }
          })
        }
      })
      .catch(err => console.log(err))
    })
    
}

exports.turnOff = (ctrl) => {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'JWT fefege...',
    'X-AIO-Key':'aio_aMbk25klg0NSmAZpEH9DuJ6wu4Sl'
  }
  const data2 = {
    "datum":
    {
      "value":"OFF"
    }
  }
  axios.post('https://io.adafruit.com/api/v2/hongphat03/feeds/maybom/data', data2, {
      headers: headers
    })
    .then((response) => {
      // console.log("OK")
    })
    .catch((error) => {
      console.log(error)
    })

    record.collection.findOne(
      {
        type:'pump'
      }
    )
    .then((data) => {
        const index = data.valueList.length
        controller.collection.findOne(
          {
            type:"pump"
          }
        )
        .then((data) => {
          if(!data){
            controller.collection.insertOne({
              id: 5,
              type: "pump",
              controlList: [
              {
                index:index,
                controller: ctrl,
                value: "OFF"
              }
              ]
            })
          }
          else{
            const list = data.controlList
            list.push({
              index:index,
              controller:ctrl,
              value: "OFF"
            })
            controller.collection.updateOne({type:"pump"},{
              $set:{
                controlList:list
              }
            })
          }
        })
        .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
}

exports.manualPump = (req,res) => {
  const status = req.params['status']
  const user = req.params['user']
  if(status === 'true') this.turnOn(user)
  else if(status === 'false') this.turnOff(user)
  res.send("OK")
}
exports.schedulePump = () => {
    schedule.find({})
    .then(schedules => {
      if(schedules.length > 0){
        // get current date, time
        let day = new Date()
        let hour = new Date().getHours();
        hour = hour<10?"0"+hour.toString():hour.toString();
        let minute = new Date().getMinutes();
        minute = minute<10?"0"+minute.toString():minute.toString();
        let curTime = hour+":"+minute;

        schedules.forEach((obj,index) => {
          
          // lặp lại theo tuần
          if(schedules[index].type === "weekly"){
            // schedules.forEach((obj) => {
              // obj.dates="2023-04-24"
              // const cur = new Date("2023-04-24");
              // console.log(cur.toDateString())
              // console.log(day.toISOString())
              // console.log(obj.dates)
              if(day.toDateString().includes(obj.dates) || day.toISOString().includes(obj.dates)  && obj.time === curTime){
                this.turnOn("system")
                const timer = Math.floor(obj.water/30)
                setTimeout(() => {
                  this.turnOff("system");
                },timer*1000)
                const current = new Date();
                current.setDate(current.getDate() + 7);
                schedule.collection.updateOne({_id: obj._id},{
                  $set:{
                    dates:current.toISOString().substring(0,10)
                  }
                })
              }
            // })
            
          } 
          // lặp lại theo tháng
          else if(schedules[index].type === "monthly"){
            // schedules.forEach((obj) => {
              let days = new Date(obj.dates)
              if(days.toISOString().substring(0,10) === day.toISOString().substring(0,10) && obj.time === curTime){
                // clearInterval(intervalObj);
                this.turnOn("system")
                const timer = Math.floor(obj.water/30)
                setTimeout(() => {
                  this.turnOff("system");
                },timer*1000)
                const month = days.getMonth()+1 < 12 ? days.getMonth()+1:0
                days.setMonth(month)
                const res = schedule.collection.updateOne({_id: obj._id},{
                  $set:{
                    dates:days.toISOString().substring(0,10)
                  }
                })
    
              }
            // })
          }
          // lặp lại trong khoảng thời gian
          else if(schedules[index].type === "custom"){
            // schedules.forEach((obj) => {
              let days = new Date(obj.dates)
              days = days.toDateString();
              if(day.toDateString() === days && obj.time === curTime){
                this.turnOn("system")
                const timer = Math.floor(obj.water/30)
                setTimeout(() => {
                  this.turnOff("system");
                },timer*1000)
                // console.log(obj._id)
                schedule.collection.deleteOne({_id:obj._id})
              }
            // })
          }

        })
        
      }
    })
    .catch(err => console.log(err))
    // res.status(200).send("Success")
}

exports.getListSchedule = (req,res) => {
  schedule.find({})
  .then(schedules => {
    res.send(schedules)
})
  .catch((err) => console.log(err))
}

exports.deleteById = (req,res) => {
  console.log(req.params['id'])
  schedule.find({_id:req.params['id']})
  .then(sche => {
    if(sche.length > 0){
      const query = {dates:sche[0].dates}
      schedule.collection.deleteOne(query, function(err, obj) {
        if (err) throw err;
      });
    }
  })
  .catch(err => console.log(err))
}

exports.updateSchedule = (req,res) => {
  schedule.find({_id:req.params['id']})
  .then(sche => {
    if(sche.length > 0){
      const data = req.body
      const query = {dates:sche[0].dates}
      const updateDoc = {
        $set: {
          time:data.time,
          water:data.water
        },
      };
      schedule.collection.updateOne(query,updateDoc)
    }
  })
  .catch(err => console.log(err))
}

exports.deleteAll = (req,res) => {
  schedule.collection.deleteMany({})
  .then(res => res)
  .catch(err => console.log(err))
}



