---
title: Our Team
layout: page
team:
  - name: Reshmy Nikith
    role: Founder & Director
    photo: /assets/media/staff/reshmy-nikith.jpg
  - name: Gowri Ramesh
    role: Founder & Director
    photo: /assets/media/staff/gowri-ramesh.jpg
  - name: Mamta Arora
    role: Admin
    photo: /assets/media/staff/mamta-arora.jpg
  - name: Geeta Patil
    role: ASD Coordinator
    photo: /assets/media/staff/geeta-patil.jpg
  - name: Sugandha Pawar
    role: Academics Coordinator
    photo: /assets/media/staff/sugandha-pawar.jpg
  - name: Dr. Pranjal Goverdhan
    role: Senior Occupational Therapist
    photo: /assets/media/staff/dr-pranjal-goverdhan.jpg
  - name: Rajinder Kaur
    role: Special Educator
    photo: /assets/media/staff/rajinder-kaur.jpg
  - name: Ranju Yadav
    role: Special Educator
    photo: /assets/media/staff/ranju-yadav.jpg
  - name: Anita Pund
    role: Special Educator
    photo: /assets/media/staff/anita-pund.jpg
  - name: Anjali Rane
    role: Special Educator
    photo: /assets/media/staff/anjali-rane.jpg
  - name: Bhushan Lonare
    role: Vocational Trainer
    photo: /assets/media/staff/bhushan-lonare.jpg
  - name: Siddhi Kharat
    role: Special Educator
    photo: /assets/media/staff/siddhi-kharat.jpg
  - name: Sneha Ambre
    role: Special Educator
    photo: /assets/media/staff/sneha-ambre.jpg
  - name: Preeti Verma
    role: Special Educator
    photo: /assets/media/staff/preeti-verma.jpg
  - name: Ashmit Thapar
    role: Special Educator
    photo: /assets/media/staff/ashmit-thapar.jpg
  - name: Rachana Mhaske
    role: NIOS Teacher
    photo: /assets/media/staff/rachana-mhaske.jpg
  - name: Rohit Sonawane
    role: Sports Coach
    photo: /assets/media/staff/rohit-sonawane.jpg
  - name: Aniket Surve
    role: Sports Coach
    photo: /assets/media/staff/aniket-surve.jpg
  - name: Sharika Rupwate
    role: Assistant Teacher
    photo: /assets/media/staff/sharika-rupwate.jpg
  - name: Prajakta Abnave
    role: Occupational Therapist
    photo: /assets/media/staff/prajakta-abnave.jpg
  - name: Pragati Dasre
    role: Occupational Therapist
    photo: /assets/media/staff/pragati-dasre.jpg
  - name: Shunkhal Vajratkar
    role: Occupational Therapist
    photo: /assets/media/staff/shunkhal-vajratkar.jpg
  - name: Nidhi Amonkar
    role: Physiotherapist
    photo: /assets/media/staff/nidhi-amonkar.jpg
  - name: Niral Palany
    role: Vocational Trainer
    photo: /assets/media/staff/niral-palany.jpg
  - name: Sangita Dange
    role: Ancillary Staff
    photo: /assets/media/staff/sangita-dange.jpg
  - name: Pragati Jadhav
    role: Ancillary Staff
    photo: /assets/media/staff/pragati-jadhav.jpg
  - name: Sheetal Katare
    role: Ancillary Staff
    photo: /assets/media/staff/sheetal-katare.jpg
  - name: Vaishali Dhanawade
    role: Ancillary Staff
    photo: /assets/media/staff/vaishali-dhanawade.jpg
---

<div class="team-grid">
{% for member in page.team %}
<div class="team-card">
  <img src="{{ member.photo | relative_url }}" alt="{{ member.name }}" class="team-photo">
  <h3>{{ member.name }}</h3>
  <p>{{ member.role }}</p>
</div>
{% endfor %}
</div>
