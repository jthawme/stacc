import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components
import Button from '../UI/Button/Button';
import SelectInput from '../UI/Inputs/SelectInput';
import NumberInput from '../UI/Inputs/NumberInput';
import Slider from '../UI/Slider/Slider';

import TimeInput from './TimeInput';

// CSS, Requires
import { EXPORTS } from '../../../modules/Constants';
import "./Controls.scss";

class Controls extends React.Component {
  static propTypes = {
    className: PropTypes.string
  };

  state = {
    options: false
  }

  toggleOptions = () => {
    this.setOptions(!this.state.options);
  }

  setOptions(options) {
    this.setState({ options });
  }

  render() {
    const { className, onExport, properties, videoInfo, onPropertyUpdate, disabled } = this.props;
    const { options } = this.state;

    const cls = classNames(
      className,
      'controls'
    );

    return (
      <div className={cls}>
        { videoInfo ? (
          <>
            <div className="controls__main">
              <div className="controls__main__left">
                <TimeInput
                  name="start"
                  onUpdate={onPropertyUpdate}
                  value={properties.start}/>

                <TimeInput
                  name="duration"
                  onUpdate={onPropertyUpdate}
                  value={properties.duration}/>

                <SelectInput
                  className="export-type"
                  contentClassName="export-type__content"
                  optionsClassName="export-type__options"
                  name="exportType"
                  triggerItem={(label, open) => (
                    <span className={`export-type__trigger controls-pad ${open ? 'export-type__trigger--open' : ''}`}>
                      {label}
                    </span>
                  )}
                  optionItem={(value, selected) => (
                    <span className={` controls-pad export-type__option ${selected ? 'export-type__option--selected' : ''}`}>
                      {value.label}
                    </span>
                  )}
                  value={properties.exportType}
                  options={Object.keys(EXPORTS).map(e => {
                    return {
                      value: EXPORTS[e],
                      label: EXPORTS[e]
                    }
                  })}
                  onUpdate={onPropertyUpdate}/>

                <Button
                  type="minimal"
                  size="medium"
                  noMargin
                  onClick={this.toggleOptions}>
                  Options +
                </Button>
              </div>
              <div className="controls__main__right">
                <Button
                  type="minimal"
                  size="large"
                  className="controls-pad"
                  noMargin
                  onClick={onExport}>
                  Save
                </Button>
              </div>
            </div>
            <Slider
              closed={!options}>
              <span>Options</span>
            </Slider>
          </>
        ) : null }
      </div>
    );
  }
}

export default Controls;
