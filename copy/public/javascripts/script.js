
// // Select all the divs with the video tag
// const divs = document.querySelectorAll('.feedp');

// // Iterate through each div and add a ScrollTrigger to it
// divs.forEach((div) => {
//   const video = div.querySelector('video');

//   // Create a timeline for the div
//   const tl = gsap.timeline({
//     scrollTrigger: {
//       trigger: div,
//       start: 'top 10%',
//       end: 'bottom 50%',
//       toggleActions: 'play none none none', // Toggle the animation on and off
//       // scrub: true,
//       markers:true
//     },
//   });

//   // Add animation to the timeline to turn off the sound of the video tag
//   // tl.to(video, { paused: true });
//   tl.to(video, { volume: 0 });
  
// });


// imp
























// var flag =0;
// document.querySelector("#search_user")
// .addEventListener("click",function(){
//     if(flag==0){
//         document.querySelector("#searchform").style.display= "initial";
//         flag=1;
//     }else{
//        document.querySelector("#searchform").style.display= "none";
//        flag=0;
//     }
// })

// gsap.to(".feedp",{
//     scrollTrigger:{
//        scroller:"body",
//        trigger:".feedp",
//        start:"top 10%",
//        markers:true
//     },
//       // y:30,
//       muted:false,
//       opacity:0,
//       ease:Expo.easeInout,
//       duration:.5,
//   })
