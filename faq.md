---
title: FAQ
layout: page
faq:
  - question: What is the address and contact information?
    answer: "Plot no 81C, Sindhi Society, Chembur, Mumbai 400074. Tel: 9967707505 / 9930978354. Email: littlehearts2009@gmail.com"
  - question: Who is the contact person?
    answer: Reshmy Nikith
  - question: Is it a residential or day school?
    answer: A day school.
  - question: What grades or levels are offered?
    answer: Pratham, NIOS (10th & 12th).
  - question: What are the school timings?
    answer: "9:30 AM to 2:00 PM."
  - question: What age group is accepted?
    answer: 2 to 18 years.
  - question: What disabilities are accepted?
    answer: "Cerebral Palsy, ASD, Learning Disability, Down's Syndrome, Slow Learners."
  - question: What is the admission process?
    answer: Basic assessment to understand the level of the child and a discussion with parents.
  - question: Is there an assessment fee before admission?
    answer: No.
  - question: What therapy services are available?
    answer: "Physiotherapy, Occupational Therapy, Speech Therapy, and Special Education."
  - question: How many students are enrolled?
    answer: Approximately 50.
  - question: What is the average class size?
    answer: 6 to 7 students.
---

<div class="faq-list">
{% for item in page.faq %}
<details class="faq-item">
  <summary>{{ item.question }}</summary>
  <p>{{ item.answer }}</p>
</details>
{% endfor %}
</div>
