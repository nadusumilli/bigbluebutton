import React, { memo } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Button from '/imports/ui/components/button/component';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import { styles } from './styles';


const intlMessages = defineMessages({
  presentationLabel: {
    id: 'app.actionsBar.actionsDropdown.presentationLabel',
    description: 'Upload a presentation option label',
  },
  presentationDesc: {
    id: 'app.actionsBar.actionsDropdown.presentationDesc',
    description: 'adds context to upload presentation option',
  },
});

const propTypes = {
  intl: intlShape.isRequired,
  amIPresenter: PropTypes.bool.isRequired,
  mountUploadPresentation: PropTypes.func.isRequired,
};

const UploadPresentationButton = ({
  intl,
  amIPresenter,
  mountUploadPresentation,
}) => {
  const handleOnClick = () => {
    if (amIPresenter) {
      mountUploadPresentation();
    } else {
      alert('Please ensure that you are presenter.');
    }
  };

  const label = intl.formatMessage(intlMessages.presentationLabel);

  return (
    <Button
      label={label}
      className={cx(styles.button, amIPresenter || styles.btn)}
      onClick={handleOnClick}
      hideLabel
      color={!amIPresenter ? 'primary' : 'default'}
      ghost={amIPresenter}
      data-test="uploadPresentation"
      icon="presentation"
      size="lg"
      circle
    />
  );
};

UploadPresentationButton.propTypes = propTypes;

export default injectIntl(memo(UploadPresentationButton));
