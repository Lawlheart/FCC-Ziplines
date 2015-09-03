function where(collection, source) {
  var arr = [];
  // What's in a name?
  for(var i=0;i<collection.length;i++) {
    for(key in source) {
      if(collection[i].hasOwnProperty(key)) {
        if(source[key] === collection[i][key]) {
          arr.push(collection[i])
        }
      }
    }
  }
  return arr;
}

where([{ first: 'Romeo', last: 'Montague' }, { first: 'Mercutio', last: null }, { first: 'Tybalt', last: 'Capulet' }], { last: 'Capulet' });