// use for header nav 
// if you change here you need to change the same in script.js
var header = new Vue({
  el:'#header',
  data:{ 
    navBarShow:false,
  },
  mounted(){
    this.checkAlert()
  },
  methods:{
    checkAlert(){
      if (localStorage['alert_update'] == null){
        setTimeout(function(){ alert("Uminfo.tech V0.15版本更新\n\t(1)飯堂資訊頁新logo🔥\n\t(2)飯堂資訊頁加入評論功能🤝\n\t(3)菜單將根據院生會發怖時更新🍔\n\t(4)澳大校巴報站測試版V0.2🚌\n\t(5)UM Secrets將每日更新🗃️\n\n-----作者的話-----\n大家2020新年快樂啊🎉🎉\n大家期待下次更新吧👻\nBy Ray👨🏼‍💻\n") }, 600)        
        localStorage['alert_update'] = 'true'
      }
    },
    alertInfo(){
      alert("Uminfo.tech V0.15版本更新\n\t(1)飯堂資訊頁新logo🔥\n\t(2)飯堂資訊頁加入評論功能🤝\n\t(3)菜單將根據院生會發怖時更新🍔\n\t(4)澳大校巴報站測試版V0.2🚌\n\t(5)UM Secrets將每日更新🗃️\n\n-----作者的話-----\n大家2020新年快樂啊🎉🎉\n大家期待下次更新吧👻\nBy Ray👨🏼‍💻\n")
    }
  }
})

var macau_bus = new Vue({
  el:'#macau_bus',
  data:{
    bus_input:'',
    mbus_lists:[],
    mbus_numbers:[],
  },
  mounted(){
    this.getLocalStorage()
    this.getBusList()
  },
  methods:{
    getLocalStorage(){
      if(localStorage['mbus_numbers'] != null){
        console.log('localStorage_mbus_numbers : '+ localStorage['mbus_numbers'])
        this.mbus_numbers = JSON.parse(localStorage['mbus_numbers'])
        console.log('this mbus_numbers :'+this.mbus_numbers)
      }else{
        console.log('no local storage')
      }
    },
    setLocalStorage(e){
      this.mbus_numbers.push(e)
      localStorage['mbus_numbers'] = JSON.stringify(this.mbus_numbers)
      console.log('mbus_numbers : '+this.mbus_numbers)
      this.getBusList()
    },
    getBusList(){
      this.mbus_lists = []
      if(this.mbus_numbers.length < 10){
        for(i = 0;i < this.mbus_numbers.length; i++){
          let bus_list = {
            bus_number:this.mbus_numbers[i],
            bus_station:1
          }
          this.mbus_lists.push(bus_list)
        }
      }else{
        alert("you can't add more")
        this.mbus_numbers = []
        localStorage['mbus_numbers'] = JSON.stringify(this.mbus_numbers)
      }
    }
  }
})


var my_methods = new Vue({
  data:{
    api_result:[]
  },
  mounted(){

  },
  methods:{
    //     Here is use to for get the zero to the time number
    addZero:(number)=>{
      if(number < 10){
        let result = '0'+number
        return result
      }
        return number
    },
    //  Here is use time line to get latest bus time to calc
    getBusTimeData(time_from,time_to){
      var d = new Date()
      var date = this.addZero(d.getDate())
      var year = d.getFullYear()
      var month = this.addZero(d.getMonth()+1)
      var hours = this.addZero(d.getHours())
      var minutes = this.addZero(d.getMinutes())
      var seconds = this.addZero(d.getSeconds())
      if(time_from.length < 4){
        time_from = '0'+ time_from
      }
      //now time
      //date_from=2019-09-09T12%3A30%3A00%2B08%3A00&date_to=2019-09-09T12%3A45%3A00%2B08%3A00
      let full_time_from = `${year}-${month}-${date}T${time_from[0]+time_from[1]}%3A${time_from[2]+time_from[3]}%3A00%2B08%3A00`
      let full_time_to = `${year}-${month}-${date}T${hours}%3A${minutes}%3A${seconds}%2B08%3A00`
      let full_api = `https://api.data.um.edu.mo/service/facilities/shuttle_bus_arrival_time/v1.0.0/all?sort_by=-datetime&date_from=${full_time_from}&date_to=${full_time_to}`
      // console.log(full_api)
      return full_api
    },
    //get bus api ,if the length is 0 return 0 , if > 0 return the data string
    getBusApi(path){
      this_ = this
      fetch(path,{
        headers: {
          Authorization: 'Bearer d779c193-af98-386d-9793-119409c66b1a',
          Accept: 'application/json'
          }
      })
        .then(function(response) {
          return response.json()
        })
        .then(function(data) {
          if(data._embedded.length == 0){
            console.log("get data false")//change function-------
            this_.api_result = null
          }else if(data._embedded.length > 0){
            console.log("get data true")//change function------
            this_.api_result = data._embedded
            console.log(this_.api_result)
          }
        })
        //check error
        .catch(function(error) {
          console.log('Request failed', error)
        })
    },
    getDataTime(data){
      let temp = data.datetime
      let location = data.station

      let year_ = parseInt(temp[0]+temp[1]+temp[2]+temp[3])
      let month_ = parseInt(temp[5]+temp[6])
      let day_ = parseInt(temp[8]+temp[9])
      let hour_ = this.addZero(parseInt(temp[11]+temp[12]))
      let minute_ = this.addZero(parseInt(temp[14]+temp[15]))
      let second_ = this.addZero(parseInt(temp[17]+temp[18]))
      let calc_time = (minute_ * 60) + second_ 
      let data_time = {'hours':hour_,'minutes':minute_,'seconds':second_,'calc_time':calc_time,'location':location}

      return data_time
    },
    
  }
})

var bus = new Vue({
    el:'#um-bus',
    data:{
      check_service_time:0,
      day_time_line:'',
      current_time:0,
      current_time_sec:0,
      current_day:'',
      current_time_line:{},
      bus_datas:{},//放巴士data
      now_location:'',
      next_location:'',
      um_location:["研究生宿舍PGH","劉少榮樓E4","大學會堂N2","行政樓N6","科技學院E11","人民社科樓E21","法學院E32","薈萃坊S4"],
      um_location_api:["研究生宿舍","劉少榮樓","大學會堂","行政樓","FST","FSS","FLL","薈萃坊"],
      bus_model:'大黃巴',
      bus_models:["大黃巴","小白巴",""],
      bus_general_time:{
        time_interlaced:''
      },
      bus_general_time_:[25,105,205,275,315,375,445],
      bus_travel_time:0,
      bus_last_time:[],
      bus_timetable:{
        school_day:{
          general:{
            time_line:[
              {
                time_from:730,
                time_to:830,
                time_interlaced:15
              },
              {
                time_from:830,
                time_to:1000,
                time_interlaced:10
              },
              {
                time_from:1000,
                time_to:1200,
                time_interlaced:15
              },
              {
                time_from:1200,
                time_to:1500,
                time_interlaced:10,
              },
              {
                time_from:1500,
                time_to:1700,
                time_interlaced:15
              },
              {
                time_from:1700,
                time_to:1900,
                time_interlaced:10
              },
              {
                time_from:1900,
                time_to:2315,
                time_interlaced:15
              },
            ]
          },
          saturday:{
            time_line:[
              {
                time_from:730,
                time_to:2315,
                time_interlaced:15
              }
            ]
          },
          public_holiday:{
            time_line:[
              {
                time_from:1000,
                time_to:1745,
                time_interlaced:15
              },
            ]
          }
        },
        day_off:{
          genreal:{
            time_line:[
              {
                time_from:800,
                time_to:1945,
                time_interlaced:15
              }
            ]
          },
          public_holiday:{
            time_line:[
              {
                time_from:1000,
                time_to:1745,
                time_interlaced:15
              }
            ]
          }
        }
      },
      bus_data_message:'',
      bus_message_lists:{
        'show':false,
        'message':''
      },
      bus_data_message_show:false,
    },
    created(){
      this.open_web_loaded()
    },
    mounted(){
      this.loopGetData()
    },
    methods:{
      loopBusData(){
        if(my_methods.api_result == null){
          console.log('api_result = null')
        }else if(my_methods.api_result.length > 0){
          console.log('api_result > 0')
          bus.bus_data_message = my_methods.getDataTime(my_methods.api_result[0])
          bus.bus_data_message_show = true
          console.log('bus_data_message')
          console.log(bus.bus_data_message)
          console.log('bus_data_message_show')
          console.log(bus.bus_data_message_show)
        }
      },
      //use for the cureent_time_sec - small_time_line.time_from
      busDataTimeCut(){
        let time_from_ = this.current_time_line.small_time_line.time_from
        time_from_ = parseInt(time_from_[2].toString()+time_from_[3].toString()) * 60

        let current_time_sec = this.current_time_sec.toString()
        let current_time_sec_ = parseInt(current_time_sec[2].toString()+current_time_sec[3].toString()) * 60
        current_time_sec_ = current_time_sec_ + parseInt(current_time_sec[4].toString()+current_time_sec[5].toString())

        calc_cut = current_time_sec_ - time_from_
        console.log(current_time_sec_ +' - '+ time_from_ + ' = ' + calc_cut)
        this.indexNumToLocation(this.calcBusStationIndex(calc_cut))
      },
      //for use calc_cut time to calc the bus station index number
      calcBusStationIndex(calc_cut){
        bus_general_time_ = this.bus_general_time_
        for(let i=0; i<bus_general_time_.length; i++){

          if(bus_general_time_[i] > calc_cut){
            return i
          }else if((i+1) == bus_general_time_.length){
            console.log('now in the status')
            return 1
          }
        }
      },
      indexNumToLocation(index){
        if(index = 99){
          this.now_location = "研究生宿舍PGH"
          this.next_location = "～等候中～"
          this.bus_message_lists.show = true
          this.bus_message_lists.message = "校巴正在研究生宿舍等候開車"
        }else{
          this.now_location = this.um_location[index-1]
          this.next_location = this.um_location[index]
        }
      },
      //first website run function
      open_web_loaded(){
        this.getCurrentDay()//add current day to data
        this.getCurrentTime()//add current time to data
        this.findDayTimeLine()//add this day time line to data
        this.findTimeLine(this.current_time)//use current time and day time line to find now time line
        // this get bus api is not return(can't use) | and here choice vhen value true or false function
        my_methods.getBusApi(my_methods.getBusTimeData(this.current_time_line.small_time_line.time_from,this.current_time_line.small_time_line.time_to))//use to get the latest bus time
        //need to delay
        setTimeout(function(){
          if(my_methods.api_result == null){
            //this function for the auto calc time and bus station
            bus.busDataTimeCut()

          }else if(my_methods.api_result.length > 0){
            console.log('first api_result > 0')
            bus.bus_data_message = my_methods.getDataTime(my_methods.api_result[0])
            bus.bus_data_message_show = true
            console.log('bus_data_message')
            console.log(bus.bus_data_message)
            console.log('bus_data_message_show')
            console.log(bus.bus_data_message_show)
          }
        },200)
      },
      getCurrentDay(){
        let date = new Date()
        this.current_day = date.getDay()
        console.log("the current day : " + date.getDay())
      },
      getCurrentTime(){
        let date = new Date()

        let current_time_ = date.getHours().toString() + my_methods.addZero(date.getMinutes())
        let current_time_sec_ = date.getHours().toString() + my_methods.addZero(date.getMinutes()) + my_methods.addZero(date.getSeconds())
        console.log("the current time Sec: "+current_time_sec_)

        // the time and day result 
        this.current_time = parseInt(current_time_)
        this.current_time_sec = parseInt(current_time_sec_)
      },
      findDayTimeLine(){
        let current_day = this.current_day
        switch(true){
          case(current_day == 0):
            this.day_time_line = this.bus_timetable.school_day.public_holiday.time_line
            break
          case(0 < current_day <= 5):
            this.day_time_line = this.bus_timetable.school_day.general.time_line
            break
          case(current_day == 6):
            this.day_time_line = this.bus_timetable.school_day.saturday.time_line
            break
          }
      },
      findTimeLine(current_time){
        let time_line = this.day_time_line //get day time line
        for(let i = 0;i<time_line.length;i++){
          if(time_line[i].time_from <= current_time){
            if(time_line[i].time_to > current_time){
              //check is it the service time
              this.check_service_time = 1
              //set the current time line 
              this.current_time_line = time_line[i]
              //out this time line result
              let current_time_line = this.current_time_line
              let current_time_differ = current_time - current_time_line.time_from

              while(current_time_differ >= 100){
                current_time_differ -= 100
              }
              this.bus_travel_time = current_time_differ % current_time_line.time_interlaced

              //count small time line
              this.current_time_line.small_time_line = {
                'time_from':`${this.current_time - this.bus_travel_time}`,
                'time_to':`${this.current_time - this.bus_travel_time + this.current_time_line.time_interlaced}`,
              }
              console.log(this.current_time_line)
            }
          }
        }
        if(this.check_service_time == 0){
          console.log("now is not the bus service time!!")
        }
        
      },
      //use for loop and auto calc the location
      loopGetData(){
        setInterval((e)=>{
          this.getCurrentTime()
        // this get bus api is not return(can't use) | and here choice vhen value true or false function
          my_methods.getBusApi(my_methods.getBusTimeData(this.current_time_line.small_time_line.time_from,this.current_time_line.small_time_line.time_to))//use to get the latest bus time
          console.log(my_methods.api_result)

          this.loopBusData()
          bus.busDataTimeCut()

        },10000)//every 10s to find the new location
      },


    }
    
  })


  
  //if this day no any bus , cut all