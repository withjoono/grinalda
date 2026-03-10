import React from 'react';
import Autosuggest from 'react-autosuggest';
import {isEmpty} from '../common/util';

function Search({majors, val, styles, theme, holder, name, disabled, childIdx}) {
  const [value, setValue] = val;
  const [suggestions, setSuggestions] = React.useState([]);
  const n = name ? name : 'name';

  const getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    return inputLength === 0
      ? []
      : majors.filter(lang => lang[n].slice(0, inputLength) === inputValue);
  };

  const getSuggestionValue = suggestion => suggestion[n];

  // Use your imagination to render suggestions.
  const renderSuggestion = suggestion => <div>{suggestion[n]}</div>;

  // Autosuggest will pass through all these props to the input.
  const onChange = (event, {newValue}) => {
    // this.setState({
    //   value: newValue
    // });
    if (childIdx !== undefined) {
      setValue(newValue, childIdx);
    } else {
      setValue(newValue);
    }
  };

  const onSuggestionsFetchRequested = ({value}) => {
    // this.setState({
    //   suggestions: getSuggestions(value)
    // });

    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    // this.setState({
    //   suggestions: []
    // });
    setSuggestions([]);
  };

  const inputProps = {
    placeholder: holder ? holder : '학과를 입력해주세요.',
    value,
    onChange: onChange,
    disabled: disabled,
  };

  return (
    <Autosuggest
      suggestions={suggestions}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      inputProps={inputProps}
      theme={theme}
    />
  );
}

export default Search;
