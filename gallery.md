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
  <img src="{{ item.image | relative_url }}" alt="{{ item.caption }}" loading="lazy">
  <figcaption>{{ item.caption }}</figcaption>
</figure>
{% endfor %}
</div>
