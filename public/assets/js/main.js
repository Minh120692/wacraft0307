/**
* Template Name: Axis
* Template URL: https://bootstrapmade.com/axis-bootstrap-corporate-template/
* Updated: Sep 13 2025 with Bootstrap v5.3.8
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

})();

// Contact popup: robust handlers (null-checked & delegated click)
(function() {
  const contactBtn = document.getElementById("contactToggleBtn");
  const contactPopup = document.getElementById("contactPopup");
  const closePopup = document.getElementById("closePopup");

  function openContactPopup() {
    if (!contactPopup) return;
    contactPopup.classList.add("active");
    // focus first input for accessibility
    const firstFocusable = contactPopup.querySelector('input[type="text"], input[type="email"], textarea, input:not([type])');
    if (firstFocusable) firstFocusable.focus();
  }

  function closeContactPopup() {
    if (!contactPopup) return;
    contactPopup.classList.remove("active");
  }

  // Floating button (if present)
  if (contactBtn) {
    contactBtn.addEventListener('click', function(e) {
      e.preventDefault();
      openContactPopup();
    });
  }

  // Delegated listener: open popup for any link with href="#contact"
  document.addEventListener('click', function(e) {
    const link = e.target.closest('a[href="#contact"]');
    if (!link) return;
    e.preventDefault();
    openContactPopup();
  });

  // Close button
  if (closePopup) {
    closePopup.addEventListener('click', function(e) {
      e.preventDefault();
      closeContactPopup();
    });
  }

  // Click outside content to close
  if (contactPopup) {
    contactPopup.addEventListener('click', function(e) {
      if (e.target === contactPopup) {
        closeContactPopup();
      }
    });
  }

})();
まずはお気
// Sync preferred date/time from AM/PM controls into the hidden datetime field
(function() {
  const preferredDate = document.getElementById('preferredDate');
  const preferredHour = document.getElementById('preferredHour');
  const preferredMinute = document.getElementById('preferredMinute');
  const preferredPeriod = document.getElementById('preferredPeriod');
  const preferredDatetimeHidden = document.getElementById('preferredDatetime');

  function updatePreferredDatetime() {
    if (!preferredDatetimeHidden || !preferredDate || !preferredHour || !preferredMinute || !preferredPeriod) return;

    const dateValue = preferredDate.value;
    const hourValue = preferredHour.value;
    const minuteValue = preferredMinute.value;
    const periodValue = preferredPeriod.value;

    if (!dateValue || !hourValue || !minuteValue || !periodValue) {
      preferredDatetimeHidden.value = '';
      return;
    }

    let hour24 = parseInt(hourValue, 10);
    if (periodValue === 'PM' && hour24 < 12) {
      hour24 += 12;
    } else if (periodValue === 'AM' && hour24 === 12) {
      hour24 = 0;
    }

    preferredDatetimeHidden.value = `${dateValue}T${String(hour24).padStart(2, '0')}:${minuteValue}`;
  }

  [preferredDate, preferredHour, preferredMinute, preferredPeriod].forEach((field) => {
    if (field) {
      field.addEventListener('input', updatePreferredDatetime);
    }
  });
})();

// Toggle active background on team members when clicked (adds keyboard support)
(function() {
  const teamMembers = document.querySelectorAll('.team-member');
  if (!teamMembers || teamMembers.length === 0) return;

  teamMembers.forEach(member => {
    // make focusable for keyboard users
    if (!member.hasAttribute('tabindex')) member.setAttribute('tabindex', '0');

    member.addEventListener('click', function(e) {
      // ignore clicks on links inside the card
      if (e.target.closest('a')) return;
      this.classList.toggle('is-active');
    });

    member.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.classList.toggle('is-active');
      }
    });
  });

})();