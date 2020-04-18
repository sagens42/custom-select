import CustomSelect from '../CustomSelect';
import { createElement, createEvent } from '../../utils/utils';

let selectTemplate = `
  <select>
    <option>One</option>
    <option>Two</option>
    <option>Three</option>
  </select>
`;

describe('Single CustomSelect', () => {
  let singleSelect;
  beforeEach(() => {
    let select = createElement(selectTemplate);
    singleSelect = new CustomSelect(select);
  });

  it('should init component', () => {
    expect(singleSelect.instance.select).not.toBeNull();
    expect(singleSelect.instance.multiple).toBeFalsy();
    expect(singleSelect.instance.keydownIndex).toBe(0);
    expect(singleSelect).toMatchSnapshot();
  });

  it('should be able to select items', () => {
    singleSelect.instance.toggleDropdown();
    expect(singleSelect.instance.customSelectList.classList).not.toContain('hidden');

    singleSelect.instance.customSelectWrapper.querySelector('li').click();
    expect(singleSelect.instance.customSelectWrapper.querySelector('li').classList).toContain('active');

    singleSelect.instance.customSelectWrapper.querySelectorAll('li')[1].click();
    expect(singleSelect.instance.customSelectWrapper.querySelector('li').classList).not.toContain('active');
    expect(singleSelect.instance.customSelectWrapper.querySelectorAll('li')[1].classList).toContain('active');
  });

  it('should be able navigate with keyboard', () => {
    // pressing down
    const downEvent = createEvent('keydown');
    downEvent.keyCode = 40;
    singleSelect.instance.toggleDropdown();
    expect(singleSelect.instance.customSelectList.classList).not.toContain('hidden');
    expect(singleSelect.instance.customSelectWrapper.querySelector('li').classList).toContain('active');

    singleSelect.instance.customSelectButton.dispatchEvent(downEvent);
    expect(singleSelect.instance.customSelectWrapper.querySelector('li').classList).not.toContain('active');
    expect(singleSelect.instance.customSelectWrapper.querySelectorAll('li')[1].classList).toContain('active');

    // pressing up
    const upEvent = createEvent('keydown');
    upEvent.keyCode = 38;
    singleSelect.instance.customSelectButton.dispatchEvent(upEvent);
    expect(singleSelect.instance.customSelectWrapper.querySelector('li').classList).toContain('active');
    expect(singleSelect.instance.customSelectWrapper.querySelectorAll('li')[1].classList).not.toContain('active');

    // pressing tab
    const tabEvent = createEvent('keydown');
    tabEvent.keyCode = 9;
    singleSelect.instance.customSelectButton.dispatchEvent(tabEvent);
    expect(singleSelect.instance.customSelectList.classList).toContain('hidden');
  });

  it('should trigger original onchange event on change', () => {
    window.callMe = jest.fn(() => {});
    let selectTemplate = `
      <select onchange="callMe()">
        <option>One</option>
        <option>Two</option>
        <option>Three</option>
      </select>
    `;
    const select = createElement(selectTemplate);
    const customSelect = new CustomSelect(select);
    customSelect.instance.customSelectWrapper.querySelector('li').click();
    expect(window.callMe).toBeCalled();
    expect(select.value).toBe('One');
  });
});

describe('Multiple CustomSelect', () => {
  let multipleSelect;
  beforeEach(() => {
    let select = createElement(selectTemplate);
    select.multiple = true;
    multipleSelect = new CustomSelect(select);
  });

  it('should init component', () => {
    expect(multipleSelect.instance.select).not.toBeNull();
    expect(multipleSelect.instance.multiple).toBeTruthy();
    expect(multipleSelect.instance.keydownIndex).toBeNull();
    expect(multipleSelect).toMatchSnapshot();
  });

  it('should be able to select items', () => {
    multipleSelect.instance.customSelectWrapper.querySelector('li').click();
    expect(multipleSelect.instance.customSelectWrapper.querySelector('li').classList).toContain('active');

    multipleSelect.instance.customSelectWrapper.querySelectorAll('li')[1].click();
    expect(multipleSelect.instance.customSelectWrapper.querySelector('li').classList).not.toContain('active');
    expect(multipleSelect.instance.customSelectWrapper.querySelectorAll('li')[1].classList).toContain('active');
  });

  it('should be able navigate with keyboard', () => {
    const options = multipleSelect.instance.customSelectWrapper.querySelectorAll('li');
    // pressing down
    const downEvent = createEvent('keydown');
    downEvent.keyCode = 40;

    multipleSelect.instance.customSelectList.dispatchEvent(downEvent);
    // double down event to be able to test ctrl + up below
    multipleSelect.instance.customSelectList.dispatchEvent(downEvent);
    expect(options[0].classList).not.toContain('active');
    expect(options[1].classList).toContain('active');
    expect(options[2].classList).not.toContain('active');

    // pressing down with ctrl
    downEvent.ctrlKey = true;
    multipleSelect.instance.customSelectList.dispatchEvent(downEvent);
    expect(options[0].classList).not.toContain('active');
    expect(options[1].classList).toContain('active');
    expect(options[2].classList).toContain('active');

    // pressing up
    const upEvent = createEvent('keydown');
    upEvent.keyCode = 38;
    multipleSelect.instance.customSelectList.dispatchEvent(upEvent);
    expect(options[0].classList).not.toContain('active');
    expect(options[1].classList).toContain('active');
    expect(options[2].classList).not.toContain('active');

    // pressing up with ctrl
    upEvent.ctrlKey = true;
    multipleSelect.instance.customSelectList.dispatchEvent(upEvent);
    expect(options[0].classList).toContain('active');
    expect(options[1].classList).toContain('active');
    expect(options[2].classList).not.toContain('active');
  });

  it('should trigger original onchange event on change', () => {
    window.callMe = jest.fn(() => {});
    let selectTemplate = `
      <select multiple onchange="callMe()">
        <option>One</option>
        <option>Two</option>
        <option>Three</option>
      </select>
    `;
    const select = createElement(selectTemplate);
    const customSelect = new CustomSelect(select);
    customSelect.instance.customSelectWrapper.querySelector('li').click();
    expect(window.callMe).toBeCalled();
    expect(select.value).toBe('One');
  });
});
