const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting){
            entry.target.classList.add('active');
        }else{
            entry.target.classList.remove('active');
        }
    });
}, {});

const elements = document.querySelectorAll('.reveal');
elements.forEach(el => observer.observe(el));