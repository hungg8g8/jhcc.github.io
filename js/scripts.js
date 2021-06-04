var lastScrollTop = 0;

window.addEventListener('DOMContentLoaded', event => {
    // Navbar shrink function
    let navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        const navbarLinks = [].slice.call(document.body.querySelectorAll('.nav-link'));
        
        if (!navbarCollapsible) {
            return;
        }

        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink');
        } else {
            navbarCollapsible.classList.add('navbar-shrink');
        }

        var st = window.scrollY;
        if　(st > 150){
            if (st > lastScrollTop){
                // downscroll
                navbarLinks.map((link)=>{link.classList.add('nav-link-fade');});
            } 
            else {
                // upscroll
                navbarLinks.map((link)=>{link.classList.remove('nav-link-fade');});
            }
        }
        lastScrollTop = (st <= 0)? 0 : st;
    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    // const mainNav = document.body.querySelector('#mainNav');
    // if (mainNav) {
    //     new bootstrap.ScrollSpy(document.body, {
    //         target: '#mainNav',
    //         offset: 72
    //     });
    // };


    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    
    // Convert the argument object which has .length property and 
    // numberic indices (so-called array-like object) to real Array
    // [].slice === Array.prototype.slice
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

});
