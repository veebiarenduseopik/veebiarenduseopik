const modal_viewport = document.querySelector('.modal_viewport');

function openNav() {
   modal_viewport.style.display = (modal_viewport.style.display === 'block') ? 'none' : 'block';
   setTimeout(() => modal_viewport.classList.toggle('active'), 100);
}

const modal_controls = document.querySelectorAll(".modal_controls")
const dimmer = document.querySelector(".dimmer")
const sections = document.querySelectorAll(".expanded_modal_section")
const close_content = document.querySelectorAll(".close_content")

let current = '';
close_content.forEach(function (item, idx) {
   item.addEventListener('click', function () {
      dimmer.classList.toggle('active')
      setTimeout(() => {
         sections[0].classList.toggle("hidden")
         current.classList.toggle("hidden")
         dimmer.classList.toggle('active')
      }, 300)
      return false;
   });
});

// smooth fade between 
modal_controls.forEach(function (item, idx) {
   item.addEventListener('click', function () {
      dimmer.classList.toggle('active')
      setTimeout(() => {
         sections.forEach(function (item) {
            item.classList.toggle("hidden")
         });      dimmer.classList.toggle('active')
         current = document.querySelector(`[data-name="${item.innerHTML}"]`);
         current.classList.remove("hidden")
      }, 300)
   });
});