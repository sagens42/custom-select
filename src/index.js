import CustomSelect from './components/CustomSelect';

function searchForSelects() {
  var selects = document.querySelectorAll('select');
  for (var i = 0; i < selects.length; i++) {
    selects[i].style.display = 'none';
    selects[i].parentNode.insertBefore(new CustomSelect(selects[i]), selects[i].nextSibling);
  }
}

if (typeof window !== 'undefined') {
  searchForSelects();
}
