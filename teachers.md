---
title: Meet The Team!
body_class: page-team
layout: page
team:
  - name: Reshmy Nikith
    role: Founder & Director
    section: leadership
    bio: "Reshmy Nikith is Ipsa aspernatur aut eum qui. Non aspernatur et sunt
      rerum. Omnis suscipit repellat dolores. Ut est laborum velit dolorem
      inventore. Dolorem illum qui recusandae dolores. Mollitia et consequatur
      fuga sed "
    photo: /assets/media/staff/reshmy-nikith.jpg
  - name: Gowri Ramesh
    role: Founder & Director
    section: leadership
    bio: "Gowri Ramesh is Ipsa aspernatur aut eum qui. Non aspernatur et sunt rerum.
      Omnis suscipit repellat dolores. Ut est laborum velit dolorem inventore.
      Dolorem illum qui recusandae dolores. Mollitia et consequatur fuga sed "
    photo: /assets/media/staff/gowri-ramesh.jpg
  - name: Mamta Arora
    role: Admin
    section: administration
    photo: /assets/media/staff/mamta-arora.jpg
  - name: Geeta Patil
    role: ASD Coordinator
    section: administration
    photo: /assets/media/staff/geeta-patil.jpg
  - name: Sugandha Pawar
    role: Academics Coordinator
    section: administration
    photo: /assets/media/staff/sugandha-pawar.jpg
  - name: Rajinder Kaur
    role: Special Educator
    section: education
    photo: /assets/media/staff/rajinder-kaur.jpg
  - name: Ranju Yadav
    role: Special Educator
    section: education
    photo: /assets/media/staff/ranju-yadav.jpg
  - name: Anita Pund
    role: Special Educator
    section: education
    photo: /assets/media/staff/anita-pund.jpg
  - name: Anjali Rane
    role: Special Educator
    section: education
    photo: /assets/media/staff/anjali-rane.jpg
  - name: Siddhi Kharat
    role: Special Educator
    section: education
    photo: /assets/media/staff/siddhi-kharat.jpg
  - name: Sneha Ambre
    role: Special Educator
    section: education
    photo: /assets/media/staff/sneha-ambre.jpg
  - name: Preeti Verma
    role: Special Educator
    section: education
    photo: /assets/media/staff/preeti-verma.jpg
  - name: Ashmit Thapar
    role: Special Educator
    section: education
    photo: /assets/media/staff/ashmit-thapar.jpg
  - name: Rachana Mhaske
    role: NIOS Teacher
    section: education
    photo: /assets/media/staff/rachana-mhaske.jpg
  - name: Rohit Sonawane
    role: Sports Coach
    section: education
    photo: /assets/media/staff/rohit-sonawane.jpg
  - name: Aniket Surve
    role: Sports Coach
    section: education
    photo: /assets/media/staff/aniket-surve.jpg
  - name: Sharika Rupwate
    role: Assistant Teacher
    section: education
    photo: /assets/media/staff/sharika-rupwate.jpg
  - name: Dr. Pranjal Goverdhan
    role: Senior Occupational Therapist
    section: therapy
    photo: /assets/media/staff/dr-pranjal-goverdhan.jpg
  - name: Prajakta Abnave
    role: Occupational Therapist
    section: therapy
    photo: /assets/media/staff/prajakta-abnave.jpg
  - name: Pragati Dasre
    role: Occupational Therapist
    section: therapy
    photo: /assets/media/staff/pragati-dasre.jpg
  - name: Shunkhal Vajratkar
    role: Occupational Therapist
    section: therapy
    photo: /assets/media/staff/shunkhal-vajratkar.jpg
  - name: Nidhi Amonkar
    role: Physiotherapist
    section: therapy
    photo: /assets/media/staff/nidhi-amonkar.jpg
  - name: Bhushan Lonare
    role: Vocational Trainer
    section: vocational-training
    photo: /assets/media/staff/bhushan-lonare.jpg
  - name: Niral Palany
    role: Vocational Trainer
    section: vocational-training
    photo: /assets/media/staff/niral-palany.jpg
  - name: Sangita Dange
    role: Ancillary Staff
    section: support
    photo: /assets/media/staff/sangita-dange.jpg
  - name: Pragati Jadhav
    role: Ancillary Staff
    section: support
    photo: /assets/media/staff/pragati-jadhav.jpg
  - name: Sheetal Katare
    role: Ancillary Staff
    section: support
    photo: /assets/media/staff/sheetal-katare.jpg
  - name: Vaishali Dhanawade
    role: Ancillary Staff
    section: support
    photo: /assets/media/staff/vaishali-dhanawade.jpg
---

{% assign sections      = "leadership,administration,education,therapy,vocational-training,support" | split: "," %}
{% assign section_labels = "Leadership,Administration,Education,Therapy,Vocational Training,Support" | split: "," %}

{% for sec in sections %}
  {% assign sec_members = page.team | where: "section", sec %}
  {% if sec_members.size > 0 %}
  {% assign sec_label = section_labels[forloop.index0] %}

<section class="team-section team-section--{{ sec }}">
<h2 class="team-section-title">{{ sec_label }}</h2>

{% if sec == "leadership" %}
<div class="team-leaders">
  {% for member in sec_members %}
  <div class="leader-card">
    <img src="{{ member.photo | relative_url }}" alt="{{ member.name }}" class="leader-photo">
    <h3 class="leader-name">{{ member.name }}</h3>
    <p class="leader-role">{{ member.role }}</p>
    {% assign bio = member.bio | strip %}
    {% if bio != "" %}<p class="leader-bio">{{ bio }}</p>{% endif %}
  </div>
  {% endfor %}
</div>
{% else %}
<div class="team-grid">
  {% for member in sec_members %}
  <div class="team-card">
    <img src="{{ member.photo | relative_url }}" alt="{{ member.name }}" class="team-photo">
    <h3>{{ member.name }}</h3>
    <p>{{ member.role }}</p>
  </div>
  {% endfor %}
</div>
{% endif %}

</section>
  {% endif %}
{% endfor %}
