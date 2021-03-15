import React, { memo } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Button from '/imports/ui/components/button/component';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import { styles } from './styles';


const intlMessages = defineMessages({
  startExternalVideoLabel: {
    id: 'app.actionsBar.actionsDropdown.shareExternalVideo',
    description: 'Start sharing external video button',
  },
  stopExternalVideoLabel: {
    id: 'app.actionsBar.actionsDropdown.stopShareExternalVideo',
    description: 'Stop sharing external video button',
  },
});

const propTypes = {
  intl: intlShape.isRequired,
  isSharingVideo: PropTypes.bool.isRequired,
  mountExternalVideoModal: PropTypes.func.isRequired,
};

const UploadPresentationButton = ({
  intl,
  isSharingVideo,
  mountExternalVideoModal,
}) => {
  const handleOnClick = () => {
    if (isSharingVideo) {
      mountExternalVideoModal();
    } else {
      alert('Please ensure that you have permissions.');
    }
  };

  const label = intl.formatMessage(intlMessages.startExternalVideoLabel);

  return (
    <Button
      label={label}
      className={cx(styles.button, isSharingVideo || styles.btn)}
      onClick={handleOnClick}
      hideLabel
      color={!isSharingVideo ? 'primary' : 'default'}
      ghost={isSharingVideo}
      data-test="uploadPresentation"
      icon="video"
      size="lg"
      circle
    />
  );
};

UploadPresentationButton.propTypes = propTypes;

export default injectIntl(memo(UploadPresentationButton));
