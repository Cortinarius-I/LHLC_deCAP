---
title: Curriculum
layout: page
---

<div class="program-grid">
{% for program in site.programs %}
  <a href="{{ program.url | relative_url }}" class="program-card">
    <h3>{{ program.title }}</h3>
    {% if program.age_range %}
      <p>Ages {{ program.age_range }}</p>
    {% endif %}
  </a>
{% endfor %}
</div>