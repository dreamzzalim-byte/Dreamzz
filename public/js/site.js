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

  // Labs : vidéo de l'exemple (lecture avec le son au clic)
  var vid = document.querySelector('.lx-video');
  if (vid) {
    var v = vid.querySelector('video'), play = vid.querySelector('.lx-play');
    play.addEventListener('click', function () { v.muted = false; v.controls = true; v.play(); vid.classList.add('on'); });
  }

  var form = document.querySelector('form.form');
  if (!form) return;
  var labs = !!form.dataset.labs;
  // Labs : « Choisir Réseaux », « Demander un devis » → coche le besoin dans le formulaire
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-need]');
    if (!a || !labs) return;
    a.dataset.need.split(' ').forEach(function (v) {
      var box = form.querySelector('input[name="besoin"][value="' + v + '"]');
      if (box) box.checked = true;
    });
  });
  // fermer le menu mobile après un clic sur un lien d'ancre
  if (nav) nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A' && nav.classList.contains('open')) { nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
  });
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
  // Labs : même adresse que le devis distributeur, la demande est résumée dans le message
  function payload() {
    var fd = new FormData(form);
    if (!labs) return new URLSearchParams(fd);
    var needs = [].map.call(form.querySelectorAll('input[name="besoin"]:checked'), function (i) { return i.parentNode.textContent.trim(); });
    var msg = '[LABS] ' + (needs.length ? needs.join(', ') : 'Besoin à définir') + ' · ' + fd.get('activite');
    if (fd.get('precisions')) msg += '\n' + fd.get('precisions');
    var out = new URLSearchParams();
    ['commerce', 'ville', 'nom', 'tel', 'email', 'site'].forEach(function (k) { out.set(k, fd.get(k) || ''); });
    out.set('type', 'autre'); out.set('offre', 'nsp'); out.set('emplacement', 'nsp'); out.set('message', msg.slice(0, 1500));
    return out;
  }
  if (labs) { ERR.champs = 'Remplis le nom du commerce, la ville et ton nom.'; ERR.trop = 'Trop de demandes. Appelle-nous au 07 67 15 17 93.'; }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.reportValidity()) return;
    if (form.dataset.preview) { msg.className = 'form-msg ok'; msg.textContent = 'Aperçu : l’envoi fonctionne sur dreamzz.fr.'; return; }
    msg.className = 'form-msg';
    msg.textContent = 'Envoi…';
    btn.disabled = true;
    fetch(form.action, { method: 'POST', body: payload() })
      .then(function (r) { return r.json().catch(function () { return { ok: false }; }); })
      .then(function (d) {
        if (d && d.ok) {
          form.innerHTML = '<div class="sent" role="status"><h2>Demande envoyée</h2><p>' + (labs ? 'On te rappelle sous 24 h.' : 'On vous rappelle sous 24 h.') + '</p></div>';
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
