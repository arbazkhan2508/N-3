// function sound(){
  
//   var flag = 0;
//   var videos = document.querySelectorAll(".str");
//   videos.forEach(function(video){
//     var video_tag = video.children[3];
//     var sound_off = video.children[1];
//     var sound_on = video.children[2];
//     video.addEventListener("click",function(){
//       if(flag === 0){
//           video_tag.muted = false;
//           sound_off.style.display = "none";
//           sound_on.style.display = "initial";
//           flag = 1;
//       }else{
//         video_tag.muted = true;
//         flag = 0;
//         sound_off.style.display = "initial";
//         sound_on.style.display = "none";
//       }
    
//     })
  
//   })
// }

// function story_feature(){
//       var grow;
//     // Select all elements with class "box"
//     var boxes = document.querySelectorAll('.str');

//     // Select the icon element
//     var icon = document.querySelector('#icon_restart');

//     // Create a GSAP timeline
//     var tl = gsap.timeline({paused: true});

//     // Loop through the elements in reverse order and add animations to the timeline
//     for (var i = boxes.length - 1; i >= 0; i--) {

//       // Add an animation to set the opacity to 0, with a delay of 1 second for each element
//       var box_video = boxes[i].children[3];
//       tl.fromTo(boxes[i], {opacity: 1}, {duration: 0.5, display: "none"}, (boxes.length - i - 1) * 3);
//     }
    
//     // Add a delay before starting the animation
//     setTimeout(function() {
//       // Start the animation by calling the timeline's play() method
//       tl.play().then(function() {
//         // Show the icon when the animation is completed
//         gsap.to(icon, {duration: 0.5, opacity: 1,delay : -.5});
//       });
//     }, 300);

//     // Add a click event listener to the icon
//     icon.addEventListener('click', function() {
//       // Reset the icon opacity to 0
//       gsap.set(icon, {opacity: 0});

//       // Restart the timeline's animation
//       tl.restart().then(function() {
//         // Show the icon when the animation is completed
//         gsap.to(icon, {duration: 0.5, opacity: 1,});
//       });
//     });


// }

// story_feature();
// sound();


