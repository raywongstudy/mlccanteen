// use for header nav
var header = new Vue({
  el:'#header',
  data:{
    navBarShow:false
  }
})

// use the main part for get canteen people 
var app = new Vue({
  el: '#canteen-people',
  data:{
    days:new Date().getDay(),
    hours:new Date().getHours(),
    items: {},
    items_length:0,
    full_day_people:0,
    urlData:{
      open:'https://cdn3.iconfinder.com/data/icons/restaurant-34/24/open_sign_hanger-512.png',
      close:'https://cdn3.iconfinder.com/data/icons/restaurant-34/24/closed_sign_hanger-512.png',
    }
  },
  mounted(){
    this.getPeopleValue();
    this.getFullDayPeople();
  },
  methods:{
    getFullDayPeople:function(){
      let count = 0;
      this.fullDayApiLink(7,30,8,30);
      this.fullDayApiLink(8,30,9,30);
      this.fullDayApiLink(9,30,10,0);
//    lunch
      this.fullDayApiLink(11,30,12,15);
      this.fullDayApiLink(12,15,13,0);
      this.fullDayApiLink(13,0,13,30);
      this.fullDayApiLink(13,30,14,30);
//    dinner
      this.fullDayApiLink(17,30,18,15);
      this.fullDayApiLink(18,15,19,0);
      this.fullDayApiLink(19,0,20,0);
      this.fullDayApiLink(20,0,20,30);
    },
    fullDayApiLink(form1,form2,to1,to2){
      path = this.getTimeData();
      let full_api = `https://api.data.umac.mo/service/student/student_meal_consumption/v1.0.0/all?rc_member=MLC&consume_date_from=${path[1]}T${this.addZero(form1)}%3A${this.addZero(form2)}%3A00%2B08%3A00&consume_date_to=${path[1]}T${this.addZero(to1)}%3A${this.addZero(to2)}%3A00%2B08%3A00`;
      this.getApiData(full_api);
    },
    getPeopleValue:function(){
      path = this.getTimeData();
      this.getApiData2('https://api.data.umac.mo/service/student/student_meal_consumption/v1.0.0/all?rc_member=MLC&consume_date_from='+path[2]+'&consume_date_to='+path[0]);
    },
    getMlcData:function(){
      this.getApiData('https://api.data.umac.mo/service/student/student_meal_consumption/v1.0.0/all?rc_member=MLC');
    },
    
    // here is use to get the api data--------------------------API-----------------------------
    getApiData:function(path){
      var _this = this;
      fetch(path,{
        headers: {
          Authorization: 'Bearer dc441188-d713-3496-976c-953bda5520cd',
          Accept: 'application/json'
          }
      })
        .then(function(response) {
          return response.json()
          // return response.text(); //return 的值到下一個then
        })
        .then(function(text) {
          let count_items = text._embedded;
          // _this.items = my_methods.shortingData(_this.items)
          _this.items = count_items;
          _this.full_day_people += count_items.length;

          // console.log('Request successful', text._embedded);
        })
  //     check error
        .catch(function(error) {
          console.log('Request failed', error)
          if(_this.items == undefined){
          _this.items_length = 0;
          _this.showData = true;
          }
        });
    },
    // here use to get api data for get and count people value ------
    getApiData2:function(path){
      var _this = this;
      fetch(path,{
        headers: {
          Authorization: 'Bearer dc441188-d713-3496-976c-953bda5520cd',
          Accept: 'application/json'
          }
      })
        .then(function(response) {
          return response.json()
        })
        .then(function(text) {
          let count_items = text._embedded;
          _this.items_length = count_items.length;
        })
        .catch(function(error) {
          console.log('Request failed', error)
          if(_this.items == undefined){
            _this.showData = true;
          }
        });
    },
  //     Here is use to for get the zero to the time number
    addZero:(number)=>{
          if(number < 10){
            let result = '0'+number
            return result;
          }
            return number;
        },
  //  Here is use to get now time and delay time
    getTimeData:function(delay_seconds){
      var d = new Date();
      var date = this.addZero(d.getDate());
      var year = d.getFullYear();
      var month = this.addZero(d.getMonth()+1);
      var hours = this.addZero(d.getHours());
      var minutes = this.addZero(d.getMinutes());
      var seconds = this.addZero(d.getSeconds()); 
  //       full now time
      var full_t = `${year}-${month}-${date}T${hours}%3A${minutes}%3A${seconds}%2B08%3A00`;
      var full_d = `${year}-${month}-${date}`
  //       delay time
      var delay_t2 = this.getDelayTime(hours,minutes,seconds,2280);
      var full_delay_t2 = `${year}-${month}-${date}T${this.addZero(delay_t2[0])}%3A${this.addZero(delay_t2[1])}%3A${this.addZero(delay_t2[2])}%2B08%3A00`;
      return [full_t,full_d,full_delay_t2];
    },
  //  Here is use to get the delay time
    getDelayTime:function(hour,minute,second,delay_t){
      hour = hour * 3600;
      minute = minute * 60;
      second = parseInt(second);//for intput second is string
      let all_count = hour + minute + second;
      all_count = all_count - delay_t;
      hour = Math.floor(all_count / 3600);      
      minute = Math.floor(all_count % 3600 / 60);
      second = all_count % 3600 % 60;
      return[hour,minute,second];
    }//end of delay time

  },//end methods
})//end vue


var my_methods = new Vue({
  data:{
  },
  methods:{
    shortingData:(all_data)=>{
      let year_,month_,day_,hour_,minute_,second_,all_time_,temp,data_obj = [];

      for(let i = 0;i < all_data.length;i++){

        temp = all_data[i].lastModifiedDate;

        for(let j = 0;j < temp.length;j++){
          year_ = parseInt(temp[0]+temp[1]+temp[2]+temp[3])
          month_ = parseInt(temp[5]+temp[6]);
          day_ = parseInt(temp[8]+temp[9]);
          hour_ = app.addZero(parseInt(temp[11]+temp[12]));
          minute_ = app.addZero(parseInt(temp[14]+temp[15]));
          second_ = app.addZero(parseInt(temp[17]+temp[18]));
          second_ = second_ * 1;
          all_time_ = (hour_ * 3600) + (minute_ * 60) + second_; 
          // data_obj[i] = {hour:hour,minute:minute,second=second}
          all_data[i].shorting_n = all_time_;
          all_data[i].consumeTime_ = `${year_}年${month_}月${day_}日${hour_}:${minute_}:${second_}`;
        }//for j end

      }//end for i
      let count_k,count_h,change;

      for(let k = 0; k < all_data.length; k++){
        count_h = all_data.length - 1 - k;
        for(let h = 0; h < count_h; h++){
          if(all_data[h].shorting_n < all_data[h+1].shorting_n){
            change = all_data[h];
            all_data[h] = all_data[h+1];
            all_data[h+1] = change;
          }
        }
      }// Here is k for end
      return all_data;
    },//shorting function end

  }//methods end
})
