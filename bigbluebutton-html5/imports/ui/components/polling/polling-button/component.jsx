import React, { memo } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Button from '/imports/ui/components/button/component';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import { styles } from './styles';


const intlMessages = defineMessages({
  pollBtnLabel: {
    id: 'app.actionsBar.actionsDropdown.pollBtnLabel',
    description: 'poll menu toggle button label',
  },
  pollBtnDesc: {
    id: 'app.actionsBar.actionsDropdown.pollBtnDesc',
    description: 'poll menu toggle button description',
  },
});

const propTypes = {
  intl: intlShape.isRequired,
  isPollingEnabled: PropTypes.bool.isRequired,
};

const PollingButton = ({
  intl,
  isPollingEnabled,
}) => {
  const handleOnClick = () => {
    if (Session.equals('pollInitiated', true)) {
      Session.set('resetPollPanel', true);
    }
    Session.set('openPanel', 'poll');
    Session.set('forcePollOpen', true);
  };

  const label = intl.formatMessage(intlMessages.pollBtnLabel);

  return (
    <Button
      label={label}
      className={cx(styles.button, isPollingEnabled || styles.btn)}
      onClick={handleOnClick}
      hideLabel
      color={!isPollingEnabled ? 'primary' : 'default'}
      ghost={isPollingEnabled}
      data-test="uploadPresentation"
      icon="polling"
      size="lg"
      circle
    />
  );
};

PollingButton.propTypes = propTypes;

export default injectIntl(memo(PollingButton));
