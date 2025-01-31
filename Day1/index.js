//////// CallBacks ////////////////////////////////////

// function connectToServer(fun){
//     console.log('Connecting to server...');

//     setTimeout(function(){
//         console.log('Connected to server!!!');
//         fun()
//     }, 2000)
// }

// function fetchCourse(fun){
//     console.log('Fetching Courses...');
//     setTimeout(function(){
//         fun(['hello', 'bye', 'kese ho'])
//     },2000)

// }

// connectToServer(function(){
//     fetchCourse(function(data){
//         console.log(data);

//     })
// })

///// Promises ////////////////////////////////////////

// function connectToServer() {
//   console.log("Connecting to server...");

//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve("Connected to Server!!!");
//     }, 2000);
//   });
// }

// function getCourses() {
//   console.log("Fetching Courses...");

//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve(["C1", "C2", "C3"]);
//     }, 2000);
//   });
// }

// connectToServer()
//   .then(function (res) {
//     console.log(res);
//     return getCourses();
//   })
//   .then(function (res) {
//     console.log("Courses are " + res);
//   });



