
const Autocomplete = scope(lively => {
  function getInitialState({ props: { value, suggestions } }) {
    const idx = suggestions.findIndex(item => item.id === value);
    const selectedItem = idx === -1 ? null : suggestions[idx];

    return {
      selectedItem,
      value: selectedItem ? selectedItem.name : '',
      filteredSuggestions: null,
      highlightedIndex: idx === -1 ? null : idx
    };
  }

  function onInputValueChange({ props: { suggestions } }, value, changes) {
    if (changes.type === Downshift.stateChangeTypes.keyDownEscape) {
      // If pressing escape, remove the filter and reset the
      // highlighted index to the current value
      return {
        value,
        filteredSuggestions: null,
        highlightedIndex: suggestions.findIndex(item => item.name === value)
      };
    } else {
      // Otherwise, filter the items and always highlight the first
      // item
      const filteredSuggestions = suggestions.filter(suggestion =>
        suggestion.name.toLowerCase().includes(value.toLowerCase())
      );
      return {
        value,
        filteredSuggestions,
        highlightedIndex: filteredSuggestions.length ? 0 : null
      };
    }
  }

  function onStateChange({ props }, changes, stateAndHelpers) {
    if ('highlightedIndex' in changes) {
      if (changes.highlightedIndex !== null) {
        return { highlightedIndex: changes.highlightedIndex };
      }
    }
  }

  function onKeyDown(
    {
      props: {
        suggestions,
        onUpdate,
        inputProps,
        shouldSaveFromKey = defaultShouldSaveFromKey
      },
      state: { filteredSuggestions, highlightedIndex }
    },
    e
  ) {
    const ESC = 27;
    const { onKeyDown } = inputProps || {};

    onKeyDown && onKeyDown(e);

    if (shouldSaveFromKey(e)) {
      e.preventDefault();
      if (highlightedIndex != null) {
        const item = (filteredSuggestions || suggestions)[highlightedIndex];
        onUpdate && onUpdate(item.id);
      }
    } else if (e.keyCode === ESC) {
      return { filteredSuggestions: null };
    }
  }

  function defaultRenderContainer(children) {
    return <div>{children}</div>;
  }

  function defaultShouldSaveFromKey(e) {
    // Enter
    return e.keyCode === 13;
  }

  function Autocomplete({
    props: {
      inputProps,
      children,
      suggestions,
      onUpdate,
      renderContainer = defaultRenderContainer
    },
    state: { value, selectedItem, filteredSuggestions, highlightedIndex },
    updater
  }) {
    const filtered = filteredSuggestions || suggestions;

    return (
      <Downshift
        onChange={onUpdate}
        highlightedIndex={highlightedIndex}
        selectedItem={selectedItem}
        itemToString={item => (item ? item.name : '')}
        inputValue={value}
        onInputValueChange={updater(onInputValueChange)}
        onStateChange={updater(onStateChange)}
      >
        {({
          getInputProps,
          getItemProps,
          getRootProps,
          isOpen,
          inputValue,
          selectedItem,
          highlightedIndex
        }) => (
          // Super annoying but it works best to return a div so we
          // can't use a View here, but we can fake it be using the
          // className
          <div
            className={'view ' + css({ display: 'flex', flex: 1 }).toString()}
          >
            <Input
              {...getInputProps({
                ...inputProps,
                inputRef: updater(onInputMounted),
                onFocus: updater(onInputFocus),
                onKeyDown: updater(onKeyDown),
                style: inputCellStyle
              })}
            />
            {filtered.length > 0 && (
                <Tooltip
                  // ... props ...
                >
                  {renderContainer(
                    filtered.map((suggestion, index) => (
                      <div
                        {...getItemProps({
                          item: suggestion.name
                        })}
                        key={suggestion.name}
                        {...css({
                          padding: 5,
                          backgroundColor:
                            highlightedIndex === index ? '#f0f0f0' : null
                        })}
                      >
                        {suggestion.name}
                      </div>
                    ))
                  )}
                </Tooltip>
              )}
          </div>
        )}
      </Downshift>
    );
  }
  return lively(Autocomplete, { getInitialState });
});




/* examples/MultipleItems.js */





import React, { Component } from 'react';
import Slider from '../src/slider';

export default class MultipleItems extends Component {
  render() {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 3
    };
    return (
      <div>
        <h2> Multiple items </h2>
        <Slider {...settings}>
          <div>
            <div className="section-deals__itemwrapper">
              <div className="section-deals__item">
                <a href="">
                  <div className="section-deals__tn"></div>1
                </a>
              </div>
            </div>
          </div>
          <div>
            <div className="section-deals__itemwrapper">
              <div className="section-deals__item">
                <a href="">
                  <div className="section-deals__tn"></div>2
                </a>
              </div>
            </div>
          </div>
          <div>
            <div className="section-deals__itemwrapper">
              <div className="section-deals__item">
                <a href="">
                  <div className="section-deals__tn"></div>3
                </a>
              </div>
            </div>
          </div>
          <div>
            <h3>4</h3>
          </div>
          <div>
            <h3>5</h3>
          </div>
          <div>
            <h3>6</h3>
          </div>
          <div>
            <h3>7</h3>
          </div>
          <div>
            <h3>8</h3>
          </div>
          <div>
            <h3>9</h3>
          </div>
        </Slider>
      </div>
    );
  }
}
