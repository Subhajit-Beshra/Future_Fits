function showSection(btn, sectionId) {
    // Remove active class from all section buttons
    const allButtons = document.querySelectorAll('.section-btn');
    allButtons.forEach((button) => {
        button.classList.remove('active');
    });
    
    // Add active class to clicked button
    btn.classList.add('active');
    
    // Show the corresponding section (you can add content display logic here)
    console.log('Section switched to:', sectionId);
}