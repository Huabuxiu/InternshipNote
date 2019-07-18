
var testArray = ['1','2','3'];

 function arrayToObject(testArray){
    var objArry=[];
      for(i =1 ; i < testArray.length+1;i++){
        var obj = {};
        obj.label = i;
        obj.value = i;
        objArry.push(obj);
      }
      return objArry;
  }
console.log(testArray);
var ansArray = arrayToObject(testArray);
console.log(ansArray);