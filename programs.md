---
title: Our Programs
layout: page
---

<div class="program-grid">
{% for program in site.programs %}
  <a href="{{ program.url | relative_url }}" class="program-card">
    <h3>{{ program.title }}</h3>
    {% if program.excerpt %}
      <p>{{ program.excerpt }}</p>
    {% endif %}
  </a>
{% endfor %}
</div>
