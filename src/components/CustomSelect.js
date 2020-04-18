import './CustomSelect.scss';
import markup from './CustomSelect.html';
import markupForMultiple from './CustomSelectMultiple.html';
import { createElement, createEvent } from '../utils/utils';

export default class CustomSelect {
  constructor(select) {
    this.select = select;
    this.multiple = select.multiple || false;
    this.keydownIndex = this.multiple ? null : 0;
    this.customSelectWrapper = document.createElement('div');
    this.customSelectWrapper.classList.add('custom-select-wrapper');
    if (this.multiple) {
      this.customSelectWrapper.innerHTML = markupForMultiple;
    } else {
      this.customSelectWrapper.innerHTML = markup;
      this.customSelectButton = this.customSelectWrapper.querySelector('button');
    }
    this.customSelectList = this.customSelectWrapper.querySelector('ul');
    // check for assosiated label
    var labeledBy = this.select.getAttribute('aria-labelledby');
    if (!labeledBy) {
      var label = document.querySelector(`label[for="${select.id}"]`);
      if (label) {
        labeledBy = label.id;
        this.customSelectButton.setAttribute('aria-labelledby', label.id);
        this.customSelectList.setAttribute('aria-labelledby', label.id);
      }
    } else {
      this.customSelectButton.setAttribute('aria-labelledby', labeledBy);
      this.customSelectList.setAttribute('aria-labelledby', labeledBy);
    }

    this.setupOptions();
    if (!this.multiple) {
      this.customSelectButton.textContent = this.select.value;
    }
    this.bindEvents();
    this.customSelectWrapper.instance = this;

    return this.customSelectWrapper;
  }

  getSelectedValues() {
    if (this.multiple) {
      const result = [];
      const options = this.select.options;
      for (let i = 0; i < options.length; i++) {
        const option = options[i];

        if (option.selected) {
          result.push(option.value || option.text);
        }
      }
      return result;
    } else {
      return this.select.value;
    }
  }

  setupOptions() {
    // setting original options
    const customSelectOptions = this.customSelectWrapper.querySelector('.custom-options');
    for (let i = 0; i < this.select.options.length; i++) {
      const customSelectOption = document.createElement('li');
      customSelectOption.classList.add('custom-option');
      customSelectOption.setAttribute('role', 'option');
      customSelectOption.textContent = this.select.options[i].textContent;

      if (this.multiple) {
        if (this.getSelectedValues().includes(this.select.options[i].textContent)) {
          customSelectOption.classList.add('active');
          customSelectOption.setAttribute('aria-selected', 'true');
        }
      } else {
        if (this.select.options[i].textContent.toLowerCase() === this.select.value.toLowerCase()) {
          customSelectOption.classList.add('active');
          customSelectOption.setAttribute('aria-selected', 'true');
        }
      }

      customSelectOption.addEventListener('click', this.onClickOnOption.bind(this));

      customSelectOptions.appendChild(customSelectOption);
    }
  }

  toggleDropdown() {
    const hidden = this.customSelectList.classList.contains('hidden');
    this.customSelectButton.parentNode.querySelector('ul').classList.toggle('hidden');
    if (hidden) {
      this.customSelectButton.setAttribute('aria-expanded', 'true');
    } else {
      this.customSelectButton.removeAttribute('aria-expanded');
    }
  }

  onClickOnOption(e) {
    const prevActive = this.customSelectWrapper.querySelector('.custom-option.active');
    if (this.multiple) {
      if (!e.metaKey && !e.ctrlKey && prevActive) {
        this.deselectItem(prevActive);
      }
      if (e.target.classList.contains('active')) {
        this.deselectItem(e.target);
      } else {
        this.selectItem(e.target);
      }
    } else {
      if (!e.target.classList.contains('active')) {
        if (prevActive) {
          this.deselectItem(prevActive);
        }
        this.selectItem(e.target);
        this.toggleDropdown();
      }
    }
    this.triggerEventOnElement(this.select, 'change');
  }

  selectItem(item) {
    item.classList.add('active');
    item.setAttribute('aria-selected', 'true');
    if (this.multiple) {
      const options = this.select.options;
      for (let i = 0; i < options.length; i++) {
        const option = options[i];
        if (option.textContent.toLowerCase() === item.textContent.toLowerCase()) {
          option.selected = true;
        }
      }
    } else {
      this.customSelectButton.textContent = item.textContent;
      this.select.value = item.textContent;
    }
  }

  deselectItem(item) {
    item.classList.remove('active');
    item.removeAttribute('aria-selected');
  }

  deselectAllItems() {
    const elements = this.customSelectWrapper.querySelectorAll('li');
    for (let i = 0; i < elements.length; i++) {
      this.deselectItem(elements[i]);
    }
  }

  findIndexOfElement(element) {
    const elements = this.customSelectWrapper.querySelectorAll('li');
    for (let i = 0; i < elements.length; i++) {
      if (element.textContent.toLowerCase() === elements[i].textContent.toLowerCase()) {
        return i;
      }
    }
  }

  detectKeyDown(e) {
    if (!this.customSelectWrapper.querySelector('ul').classList.contains('hidden')) {
      const selectedItem = this.keydownIndex != null ? this.customSelectWrapper.querySelectorAll('li')[this.keydownIndex] : null;
      if ((e.which || e.keyCode) === 40) { // down
        if (selectedItem) {
          const nextItem = selectedItem.nextElementSibling;
          if (nextItem) {
            if (this.multiple) {
              if (!e.metaKey && !e.ctrlKey) {
                this.deselectAllItems();
              }
            } else {
              this.deselectItem(selectedItem);
            }
            this.selectItem(nextItem);
            this.keydownIndex = this.findIndexOfElement(nextItem);
          }
        } else {
          const firstItem = this.customSelectWrapper.querySelector('li');
          if (firstItem) {
            this.selectItem(firstItem);
            this.keydownIndex = 0;
          }
        }
    } else if ((e.which || e.keyCode) === 38) { // up
        if (selectedItem) {
          const previousItem = selectedItem.previousElementSibling;
          if (previousItem) {
            if (this.multiple) {
              if (!e.metaKey && !e.ctrlKey) {
                this.deselectAllItems();
              }
            } else {
              this.deselectItem(selectedItem);
            }
            this.selectItem(previousItem);
            this.keydownIndex = this.findIndexOfElement(previousItem);
          }
        }
      } else if ((e.which || e.keyCode) === 9) { // tab
        if (!this.multiple) {
          this.toggleDropdown();
        }
      }
    }
  }

  bindEvents() {
    // setting events
    if (!this.multiple) {
      this.customSelectButton.addEventListener('click', this.toggleDropdown.bind(this));
      this.customSelectButton.addEventListener('keydown', this.detectKeyDown.bind(this));
    } else {
      this.customSelectList.addEventListener('keydown', this.detectKeyDown.bind(this));
    }

    // trigger main events on original select just in case if developer binds custom events to origincal select
    // this.customSelectWrapper.addEventListener('click', this.triggerEventOnOriginalSelect.bind(this));
    // this.customSelectWrapper.addEventListener('keydown', this.triggerEventOnOriginalSelect.bind(this));
    // this.customSelectWrapper.addEventListener('keyup', this.triggerEventOnOriginalSelect.bind(this));
    // this.customSelectWrapper.addEventListener('focus', this.triggerEventOnOriginalSelect.bind(this));
    // this.customSelectWrapper.addEventListener('blur', this.triggerEventOnOriginalSelect.bind(this));
  }

  triggerEventOnOriginalSelect(e) {
    this.select.dispatchEvent(e);
  }

  triggerEventOnElement(element, eventType) {
    const event = createEvent(eventType);
    this.select.dispatchEvent(event);
  }
}
