document.addEventListener('click', function(e) {
  console.log(e.target);
  if (e.target && e.target.name === 'category') {
    if (e.target.value === 'yes' || e.target.value === 'bits') {
      document.getElementById('link-info').hidden = !0;
    } else if (e.target.value === 'linking') {
      document.getElementById('link-info').hidden = !1;
    }
  }
  if (e.target && e.target.name === 'changePhoto') {
    if (e.target.value === 'no') {
      document.getElementById('get-img').hidden = !0;
      document.getElementById('show-img').hidden = !1;
    } else if (e.target.value === 'yes') {
      document.getElementById('get-img').hidden = !1;
      document.getElementById('show-img').hidden = !0;
    }
  }

  if (e.target && e.target.name === 'changeAnonymous') {
    if (e.target.value === 'no') {
      document.getElementById('show-anonymous').hidden = !0;
    } else if (e.target.value === 'yes') {
      document.getElementById('show-anonymous').hidden = !1;
    }
  }
});
