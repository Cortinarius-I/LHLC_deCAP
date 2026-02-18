---
title: Gallery
layout: page
gallery:
  - image: /assets/media/activities/children-day.jpg
    caption: Children's Day
  - image: /assets/media/activities/color-days.jpg
    caption: Color Days
  - image: /assets/media/activities/independence-day.jpg
    caption: Independence Day
  - image: /assets/media/activities/ganpati-celebration.jpg
    caption: Ganpati Celebration
  - image: /assets/media/activities/janmashtmi.jpg
    caption: Janmashtami
  - image: /assets/media/activities/dussehra.jpg
    caption: Dussehra
  - image: /assets/media/activities/friendship-day.jpg
    caption: Friendship Day
  - image: /assets/media/activities/guru-punima.jpg
    caption: Guru Purnima
  - image: /assets/media/activities/rakshabandhan.jpg
    caption: Raksha Bandhan
  - image: /assets/media/activities/teachers-day-celebration.jpg
    caption: Teachers' Day
  - image: /assets/media/activities/occupational-therapy.jpg
    caption: Occupational Therapy
  - image: /assets/media/activities/fundraising-event.jpg
    caption: Fundraising Event
---

<div class="gallery-grid">
{% for item in page.gallery %}
<figure class="gallery-item">
  <a href="{{ item.image | relative_url }}" class="gallery-link" data-caption="{{ item.caption }}">
    <img src="{{ item.image | relative_url }}" alt="{{ item.caption }}" loading="lazy">
  </a>
  <figcaption>{{ item.caption }}</figcaption>
</figure>
{% endfor %}
</div>

<!-- Lightbox -->
<div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="Image viewer">
  <button class="lightbox-close" aria-label="Close">&times;</button>
  <img class="lightbox-img" src="" alt="">
  <p class="lightbox-caption"></p>
</div>

<script>
(function() {
  var lb = document.getElementById('lightbox');
  var lbImg = lb.querySelector('.lightbox-img');
  var lbCap = lb.querySelector('.lightbox-caption');

  document.querySelectorAll('.gallery-link').forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      lbImg.src = this.href;
      lbImg.alt = this.dataset.caption;
      lbCap.textContent = this.dataset.caption;
      lb.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  lb.querySelector('.lightbox-close').addEventListener('click', closeLb);
  lb.addEventListener('click', function(e) {
    if (e.target === lb) closeLb();
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && lb.classList.contains('active')) closeLb();
  });

  function closeLb() {
    lb.classList.remove('active');
    document.body.style.overflow = '';
  }
})();
</script>
