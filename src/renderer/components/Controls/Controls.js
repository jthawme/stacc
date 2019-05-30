import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components
import Button from '../UI/Button/Button';
import SelectInput from '../UI/Inputs/SelectInput';
import NumberInput from '../UI/Inputs/NumberInput';
import CheckedInput from '../UI/Inputs/CheckedInput';
import Slider from '../UI/Slider/Slider';

import TimeInput from './TimeInput';

// CSS, Requires
import { EXPORTS } from '../../../modules/Constants';
import "./Controls.scss";
import Progress from '../UI/Progress/Progress';
import Incrementer from '../Incrementer/Incrementer';

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
    const { className, onExport, properties, videoInfo, onPropertyUpdate, disabled, progress } = this.props;
    const { options } = this.state;

    const cls = classNames(
      className,
      'controls'
    );

    return (
      <div className={cls}>
        { videoInfo ? (
          <>
            <Progress
              className="controls__progress"
              percent={progress}/>
            <div className="controls__main">
              <div className="controls__main__left">
                <TimeInput
                  disabled={disabled}
                  name="start"
                  onUpdate={onPropertyUpdate}
                  value={properties.start}/>

                <TimeInput
                  disabled={disabled}
                  name="duration"
                  onUpdate={onPropertyUpdate}
                  value={properties.duration}/>

                <SelectInput
                  disabled={disabled}
                  contentClassName="export-type__content"
                  optionsClassName="export-type__options"
                  className="export-type controls-button"
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
                  disabled={disabled}
                  type="none"
                  size="medium"
                  className="controls-button"
                  noMargin
                  onClick={this.toggleOptions}>
                  Options +
                </Button>
              </div>
              <div className="controls__main__right">
                <Button
                  disabled={disabled}
                  type="none"
                  size="large"
                  className="controls-button"
                  noMargin
                  onClick={onExport}>
                  Save
                </Button>
              </div>
            </div>
            <Slider
              closed={!options}>
              <div className="controls__sub">
                <div className="controls__sub-column">
                  <Incrementer
                    name="scaledDown"
                    label={<span className="controls__sub-input__title">Scale</span>}
                    className="controls__sub-input"
                    onUpdate={onPropertyUpdate}
                    value={properties.scaledDown}
                    min={1}
                    max={4}/>
                </div>
                <div className="controls__sub-column">
                  <Incrementer
                    name="scaledFps"
                    label={<span className="controls__sub-input__title">FPS</span>}
                    className="controls__sub-input"
                    onUpdate={onPropertyUpdate}
                    value={properties.scaledFps}
                    min={1}
                    max={4}/>
                </div>
                <div className="controls__sub-column">
                  <Slider
                    closed={properties.exportType !== EXPORTS.GIF}>
                    <CheckedInput
                      name="sampleColors"
                      label={<span className="controls__sub-input__title">Sample Colors</span>}
                      className="controls__sub-input"
                      checkedEl={<span>Yes</span>}
                      uncheckedEl={<span>No</span>}
                      onUpdate={onPropertyUpdate}
                      value={properties.sampleColors}/>
                  </Slider>
                </div>
              </div>
            </Slider>
          </>
        ) : null }
      </div>
    );
  }
}

export default Controls;
