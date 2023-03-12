exports.max100 = (number) => {
   if(number > 100) return 100;
   return number.toFixed(2);
}