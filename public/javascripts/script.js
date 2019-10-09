document.addEventListener('click', function (e) {
  console.log(e.target)
  if (e.target && e.target.name === 'category') {
    if (e.target.value === 'yes' || e.target.value === 'bits') {
      document.getElementById('link-info').hidden = !0;
    } else if (e.target.value === 'linking') {
      document.getElementById('link-info').hidden = !1;
    }
  }
})