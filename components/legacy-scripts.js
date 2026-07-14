import Script from "next/script";

export default function LegacyScripts({ idSuffix = "" }) {
  return (
    <>
      <Script src="/assets/vendor/bootstrap/js/bootstrap.bundle.min.js" strategy="afterInteractive" />
      <Script src="/assets/vendor/php-email-form/validate.js" strategy="afterInteractive" />
      <Script src="/assets/vendor/aos/aos.js" strategy="afterInteractive" />
      <Script src="/assets/vendor/purecounter/purecounter_vanilla.js" strategy="afterInteractive" />
      <Script id={`site-init${idSuffix}`} strategy="afterInteractive">
        {`(function () {
          const preloader = document.getElementById('preloader');
          if (preloader) preloader.remove();

          const body = document.body;
          const toggleBtn = document.querySelector('.mobile-nav-toggle');
          if (toggleBtn) {
            toggleBtn.addEventListener('click', function () {
              body.classList.toggle('mobile-nav-active');
              toggleBtn.classList.toggle('bi-list');
              toggleBtn.classList.toggle('bi-x');
            });
          }

          document.querySelectorAll('#navmenu a').forEach(function (link) {
            link.addEventListener('click', function () {
              if (body.classList.contains('mobile-nav-active') && toggleBtn) {
                body.classList.remove('mobile-nav-active');
                toggleBtn.classList.add('bi-list');
                toggleBtn.classList.remove('bi-x');
              }
            });
          });

          const scrollTop = document.getElementById('scroll-top');
          function syncScrollTop() {
            if (!scrollTop) return;
            scrollTop.classList.toggle('active', window.scrollY > 100);
          }
          if (scrollTop) {
            scrollTop.addEventListener('click', function (e) {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            syncScrollTop();
            document.addEventListener('scroll', syncScrollTop);
          }

          if (typeof AOS !== 'undefined') {
            if (typeof AOS.refreshHard === 'function') {
              AOS.refreshHard();
            } else if (typeof AOS.refresh === 'function') {
              AOS.refresh();
            }
          } else {
            document.documentElement.classList.add('aos-ready');
          }

          if (typeof PureCounter !== 'undefined') {
            new PureCounter();
          }
        })();`}
      </Script>
      <Script id={`preferred-datetime${idSuffix}`} strategy="afterInteractive">
        {`(function(){
          function pad(n){ return String(n).padStart(2,'0'); }
          function buildPreferred(){
            var dateEl = document.getElementById('preferredDate');
            var hourEl = document.getElementById('preferredHour');
            var minEl = document.getElementById('preferredMinute');
            var periodEl = document.getElementById('preferredPeriod');
            var hidden = document.getElementById('preferredDatetime');
            if(!hidden) return;
            var date = dateEl ? dateEl.value : '';
            var hour = hourEl ? hourEl.value : '';
            var minute = minEl ? minEl.value : '00';
            var period = periodEl ? periodEl.value : '';
            if(!date || !hour){ hidden.value = ''; return; }
            var h = parseInt(hour, 10);
            if(period === 'PM' && h < 12) h += 12;
            if(period === 'AM' && h === 12) h = 0;
            hidden.value = date + ' ' + pad(h) + ':' + pad(minute || '00');
          }
          var form = document.querySelector('form.php-email-form');
          if(form){
            ['preferredDate','preferredHour','preferredMinute','preferredPeriod'].forEach(function(id){
              var el = document.getElementById(id);
              if(el) el.addEventListener('change', buildPreferred);
            });
            form.addEventListener('submit', function(){ buildPreferred(); });
          }
        })();`}
      </Script>
    </>
  );
}
