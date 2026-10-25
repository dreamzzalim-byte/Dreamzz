// dreamzz.fr — menu mobile et formulaire de devis
(function () {
  var burger = document.querySelector('.burger');
  var nav = document.getElementById('nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  var form = document.getElementById('devis');
  if (!form) return;
  var params = new URLSearchParams(location.search);
  var offre = params.get('offre');
  if (offre && form.offre) {
    var opt = form.querySelector('input[name="offre"][value="' + offre.replace(/[^a-z]/g, '') + '"]');
    if (opt) opt.checked = true;
  }
  var msg = form.querySelector('.form-msg');
  var btn = form.querySelector('button[type="submit"]');
  var ERR = {
    champs: 'Remplissez le nom du commerce, la ville et votre nom.',
    tel: 'Vérifiez le numéro de téléphone.',
    email: 'Vérifiez l’adresse e-mail.',
    cp: 'Le code postal doit avoir 5 chiffres.',
    trop: 'Trop de demandes. Appelez-nous au 07 67 15 17 93.'
  };
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.reportValidity()) return;
    if (form.dataset.preview) { msg.className = 'form-msg ok'; msg.textContent = 'Aperçu : l’envoi fonctionne sur dreamzz.fr.'; return; }
    msg.className = 'form-msg';
    msg.textContent = 'Envoi…';
    btn.disabled = true;
    fetch(form.action, { method: 'POST', body: new URLSearchParams(new FormData(form)) })
      .then(function (r) { return r.json().catch(function () { return { ok: false }; }); })
      .then(function (d) {
        if (d && d.ok) {
          form.innerHTML = '<div class="sent" role="status"><h2>Demande envoyée</h2><p>On vous rappelle sous 24 h.</p></div>';
          window.scrollTo({ top: form.getBoundingClientRect().top + window.scrollY - 120 });
          return;
        }
        throw new Error((d && d.error) || 'envoi');
      })
      .catch(function (err) {
        btn.disabled = false;
        msg.className = 'form-msg err';
        msg.textContent = ERR[err.message] || 'Envoi impossible. Appelez-nous au 07 67 15 17 93.';
      });
  });
})();
