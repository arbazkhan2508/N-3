
// const observer = new IntersectionObserver(entries => {
//   // code to handle intersection changes
// });

// const sections = document.querySelectorAll('.reelsdiv ');

// sections.forEach(section => {
//   observer.observe(section);
// });


//  observer = new IntersectionObserver(entries => {
//   entries.forEach(entry => {
//     const video = entry.target.querySelector('video');
//     if (entry.isIntersecting) {
//       video.muted = true;
//     } else {
//       video.muted = false;
//     }
//   });
// });





























// // Get all the video tags in the document
// const videos = document.querySelectorAll('.reelsdiv video');

// // Initialize a variable to keep track of the last played video
// let lastPlayedVideo;

// // Listen to the window scroll event
// window.addEventListener('scroll', () => {
//   // Get the current div in the viewable area
//   const currentDiv = getCurrentDiv();

//   // Get the video tag inside the current div
//   const video = currentDiv.querySelector('video');

//   // Pause the last played video, if any
//   if (lastPlayedVideo && lastPlayedVideo !== video) {
//     lastPlayedVideo.pause();
//   }

//   // Play the current video if it's not already playing
//   if (!video.paused) {
//     video.play();
//   }

//   // Update the last played video
//   lastPlayedVideo = video;
// });

// // Function to get the current div in the viewable area
// function getCurrentDiv() {
//   // Get all the divs with the "video-container" class
//   const divs = document.querySelectorAll('.reelsdiv');

//   // Loop through the divs and find the one in the viewable area
//   for (const div of divs) {
//     const rect = div.getBoundingClientRect();
//     if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
//       return div;
//     }
//   }
// }

// // Listen to the window scroll event in reverse order
// window.addEventListener('scroll', () => {
//   // Get all the divs with the "video-container" class
//   const divs = document.querySelectorAll('.reelsdiv');

//   // Loop through the divs in reverse order and find the one in the viewable area
//   for (let i = divs.length - 1; i >= 0; i--) {
//     const div = divs[i];
//     const rect = div.getBoundingClientRect();
//     if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
//       const video = div.querySelector('video');
//       video.pause();
//       break;
//     }
//   }
// });


















// // const videoContainers = document.querySelectorAll('.reelsdiv');

// // const observer = new IntersectionObserver((entries) => {
// //   entries.forEach((entry) => {
// //     const video = entry.target.querySelector('video');
    
// //     if (entry.isIntersecting) {
// //       video.play();
// //     } else {
// //       video.pause();
// //     }
// //   });
// // });

// // videoContainers.forEach((container) => {
// //   observer.observe(container);
// // });



// // // Get all the video elements and their parent divs
// // const videoDivs = document.querySelectorAll('.reelsdiv');

// // // Add a scroll event listener to the window object
// // window.addEventListener('scroll', () => {
// //   // Loop through all the parent divs
// //   videoDivs.forEach((div) => {
// //     // Check if the div is in the viewport
// //     const rect = div.getBoundingClientRect();
// //     const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;

// //     // Set the muted property of the video element based on visibility
// //     const video = div.querySelector('video');
// //     video.muted = !isVisible;
// //     video.pause();
// //   });
// // });
