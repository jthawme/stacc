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
import ToolTip from '../ToolTip/ToolTip';
import Icon from '../UI/Icon/Icon';
import FileFeatures from '../FileFeatures/FileFeatures';

class Controls extends React.Component {
  static propTypes = {
    className: PropTypes.string
  };

  state = {
    options: false
  }

  componentDidUpdate(oldProps) {
    if (this.props.disabled && !oldProps.disabled) {
      this.setOptions(false);
    }
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
              size="free"
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
                  triggerItem={(label, open, disabled) => (
                    <span className={`export-type__trigger controls-pad ${open ? 'export-type__trigger--open' : ''} ${disabled ? 'export-type__trigger--disabled' : ''}`}>
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
                    label={(
                      <span className="controls__sub-input__title">
                        Scale
                        <ToolTip
                          tip="Scales the resolution down">
                          <Icon icon="help-circle" size="small"/>
                        </ToolTip>
                      </span>
                    )}
                    className="controls__sub-input"
                    onUpdate={onPropertyUpdate}
                    value={properties.scaledDown}
                    min={1}
                    max={4}/>
                </div>
                <div className="controls__sub-column">
                  <Incrementer
                    name="scaledFps"
                    label={(
                      <span className="controls__sub-input__title">
                        FPS
                        <ToolTip
                          tip="Reduces the frames per second by a factor">
                          <Icon icon="help-circle" size="small"/>
                        </ToolTip>
                      </span>
                    )}
                    className="controls__sub-input"
                    onUpdate={onPropertyUpdate}
                    value={properties.scaledFps}
                    min={1}
                    max={4}/>
                </div>
                {
                  properties.exportType === EXPORTS.GIF ? (
                    <div className="controls__sub-column">
                      <CheckedInput
                        name="sampleColors"
                        label={(
                          <span className="controls__sub-input__title">
                            Sample colors
                            <ToolTip
                              tip="Resamples colour for every frame">
                              <Icon icon="help-circle" size="small"/>
                            </ToolTip>
                          </span>
                        )}
                        className="controls__sub-input"
                        checkedEl={<span>Yes</span>}
                        uncheckedEl={<span>No</span>}
                        onUpdate={onPropertyUpdate}
                        value={properties.sampleColors}/>
                    </div>
                  ) : null }
                <div className="controls__sub-column controls__sub-column--last">
                  <FileFeatures
                    videoInfo={videoInfo}
                    properties={properties}/>
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
