import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components
import Button from '../UI/Button/Button';
import SelectInput from '../UI/Inputs/SelectInput';

// CSS, Requires
import { EXPORTS } from '../../../modules/Constants';
import "./Controls.scss";

class Controls extends React.Component {
  static propTypes = {
    className: PropTypes.string
  };

  render() {
    const { className, onExport, properties, videoInfo, onPropertyUpdate, disabled } = this.props;

    const cls = classNames(
      className,
      'controls'
    );

    return (
      <div className={cls}>
        { videoInfo ? (
          <div className="controls__main">
            <div className="controls__main__left">
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
            </div>
            <div className="controls__main__right">
              <Button
                className="controls-pad"
                noMargin
                onClick={onExport}>
                Save
              </Button>
            </div>
          </div>
        ) : null }
      </div>
    );
  }
}

export default Controls;
