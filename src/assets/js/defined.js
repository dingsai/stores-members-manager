export const STATUSCODE = {
    code01:"200"
}
export const Defined= {
    Date:{
        strToTime:function strToTime(timestr,hms){
            var patter =arguments.length > 2 && arguments[2] !==undefined ? arguments[2] : '-';
            if(timestr){
                if(timestr.toString().indexOf("-") !=-1){
                    timestr = timestr .toString().replace(/-/g,"/");
                } else{
                    timestr = timestr *1;
                }
                var time = new Date(timestr);
                var Y = time.getFullYear();
                var M = time.getMonth() + 1;
                var D = time.getDate();
    
                var h = time.getHours();
                var m = time.getMinutes();
                var s = time.getSeconds();
                var ymd = void 0;
                if(patter == "string"){
                    ymd= Y+"年"+(M <10 ? '0' + M : M)+"月" + (D <10 ? '0' + D : D)+"日";
                } else {
                    ymd= Y+patter+(M <10 ? '0' + M : M)+ patter + (D <
                        10 ? '0' + D : D);
                }
                if(hms){
                    var hms_h ="";
                    var hms_m ="";
                    var hms_s ="";
                    hms_h = hms.indexOf("h")!=-1? " "+(h<10 ? '0'+h:h):"";
                    hms_m = hms.indexOf("m")!=-1? ":"+(m<10 ? '0'+m:m):"";
                    hms_s = hms.indexOf("s")!=-1? ":"+(s<10 ? '0'+s:s):"";
                    return ymd + hms_h+ hms_m +hms_s;
    
                }else {
                    return ymd;
                }
            } else{
                return ""
            }
        },
        timeToStr:function (timestr){
            return new Date(timestr).getTime();
        },
        timeToDate:function(time,patter){ //默认时间格式转 年月日
            if(time){
                return this.strToTime(new Date(time).getTime(),patter)
            }
        },
        pickerOptions: {
            shortcuts: [{
              text: '最近一周',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '最近一个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '最近三个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit('pick', [start, end]);
              }
            }]
          },
    },
    Amount : {
        format:function(s,n){
            var noEmpty=arguments.length>2 && arguments[2] !=undefined ? arguments[2] :true;
            var rounding=arguments.length>3 && arguments[3] !=undefined ? arguments[3] :true;
            var thousand=arguments.length>4 && arguments[4] !=undefined ? arguments[4] :true;
            //传过来的数超过20位会转成科学计数法
            s =s? s.toString():'0';
            if(isNaN(s) && typeof s!="number") return noEmpty ? 0.0.toFixed(n) +"":'';
            if(!rounding){
                var _index = s.indexOf(".");
                if(_index !== -1){
                    s=s.substring(0, n+_index +1);
                }else {
                    s=s.substring(0);
                }
            }
            if(!thousand){
                var z = s.indexOf(".");
                for(var i=0;i<n;++i){
                    z+='0';
                }
                return s+"."+z;
            }
            var num=void 0;
            var index= s.indexOf(".");
            if(index == -1){
                var _z="";
                for(var _i=0;_i<n;++_i){
                    _z+='0';
                }
                num = s.replace(/(\B)(?=(\d{3})+(\.\d*)?$)/g,'$1,')+"."+_z;
            } else{
                var data=s.split(".");
                var beforeNum=data[0];
                var afterNum = data[1];
                if(afterNum.length<n){
                    for(var _i2 =0;_i2<n;++_i2){
                        afterNum+='0';
                    }
                }
                num=beforeNum.replace(/(\B)(?=(\d{3})+(\.\d*)?$)/g,'$1,')+"."+afterNum.substring(0,n);
            }
            return num;
        }
    },
    GetQueryString:function(name){
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return unescape(r[2]); return null;
    }
}

  