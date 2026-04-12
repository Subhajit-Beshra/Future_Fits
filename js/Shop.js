const slider = document.getElementById('countSlider');
const countDisplay = document.getElementById('count-value');
 if(slider && countDisplay){
    countDisplay.textContent = slider.value;
    slider.addEventListener('input', () => {
        countDisplay.textContent = slider.value;
    })
 }

 const favouriteIcons = document.querySelectorAll('.material-symbols-outlined');
 favouriteIcons.forEach(icon => {
    icon.addEventListener("click", () => {
        icon.classList.toggle('active');
    })
 })