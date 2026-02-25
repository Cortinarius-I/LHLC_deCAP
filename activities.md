---
title: Activities
layout: page
---

<div class="activities-grid">
{% for activity in site.activities %}
<a href="{{ activity.url | relative_url }}" class="activity-card">
  {% if activity.drive_id and activity.drive_id != "" %}
    <img src="https://drive.google.com/thumbnail?id={{ activity.drive_id }}&sz=w600"
         alt="{{ activity.title }}" loading="lazy">
  {% elsif activity.image and activity.image != "" %}
    <img src="{{ activity.image | relative_url }}" alt="{{ activity.title }}" loading="lazy">
  {% else %}
    <div class="activity-card-placeholder" aria-hidden="true"></div>
  {% endif %}
  <div class="activity-card-body">
    <h3>{{ activity.title }}</h3>
    {% if activity.category %}
    <span class="activity-tag">{{ activity.category }}</span>
    {% endif %}
  </div>
</a>
{% endfor %}
</div>
