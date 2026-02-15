---
title: Activities
layout: page
---

<div class="activities-grid">
{% for activity in site.activities %}
<a href="{{ activity.url | relative_url }}" class="activity-card">
  {% if activity.image and activity.image != "" %}
  <img src="{{ activity.image | relative_url }}" alt="{{ activity.title }}" loading="lazy">
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
