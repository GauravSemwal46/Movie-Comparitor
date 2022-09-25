const createAutoComplete = ({
  root,
  renderOption,
  onOptionSelect,
  inputValue,
  fetchData,
}) => {
  root.innerHTML = `
<label><b>Search</b></label>
<input class="input"/>
<div class="dropdown">
    <div class="dropdown-menu">
        <div class="dropdown-content results">
        </div>
    </div>
</div>
`;

  const input = root.querySelector('input');
  const dropdown = root.querySelector('.dropdown');
  const resultWrapper = root.querySelector('.results');

  const onInput = async (event) => {
    const items = await fetchData(event.target.value);

    if (!items.length) {
      dropdown.classList.remove('is-active');
      return;
    }

    //Before display new searched list clear the previous list
    resultWrapper.innerHTML = '';

    //Adding the class to display the dropdown.
    dropdown.classList.add('is-active');

    //Iterate over searched items to display in the dropdown.
    for (let item of items) {
      const option = document.createElement('a');

      //Add dropdown items.
      option.classList.add('dropdown-item');
      option.innerHTML = renderOption(item);

      option.addEventListener('click', () => {
        dropdown.classList.remove('is-active');
        input.value = inputValue(item);
        onOptionSelect(item);
      });
      resultWrapper.append(option);
    }
  };

  //For limit the api calls we are using debouncing here.
  input.addEventListener('input', debounce(onInput, 500));

  //Hide the dropdown if user click anywhere outside of the dropdown list.
  document.addEventListener('click', () => {
    if (!root.contains(event.target)) {
      dropdown.classList.remove('is-active');
    }
  });
};
