import React from 'react';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import Button from '/imports/ui/components/button/component';
import { withModalMounter } from '/imports/ui/components/modal/service';
import PropTypes from 'prop-types';
import { styles } from '../styles';
import EndMeetingModalContainer from './end-meeting-modal/container';
import { makeCall } from '/imports/ui/services/api';

const propTypes = {
  intl: intlShape.isRequired,
  amIModerator: PropTypes.bool.isRequired,
};

const intlMessages = defineMessages({
  leaveMeetingLabel: {
    id: 'app.leaveConfirmation.confirmLabel',
    description: 'Leave Meeting option label',
  },
  leaveMeetingDescription: {
    id: 'app.leaveConfirmation.confirmDesc',
    description: 'button to leave meeting or logout of the session.',
  },
});

const handleLeave = (amIModerator, mountModal) => {
  if (amIModerator) {
    mountModal(<EndMeetingModalContainer />);
  } else {
    const LOGOUT_CODE = '680';
    makeCall('userLeftMeeting');
    // we don't check askForFeedbackOnLogout here,
    // it is checked in meeting-ended component
    Session.set('codeError', LOGOUT_CODE);
    // mountModal(<MeetingEndedComponent code={LOGOUT_CODE} />);
  }
};

const EndMeetingButton = ({ intl, amIModerator, mountModal }) => (
  <Button
    className={styles.button}
    icon="application"
    label={intl.formatMessage(intlMessages.leaveMeetingLabel)}
    description={intl.formatMessage(intlMessages.leaveMeetingDescription)}
    color="danger"
    size="lg"
    onClick={() => handleLeave(amIModerator, mountModal)}
    id="end-meeting-button"
  />
);

EndMeetingButton.propTypes = propTypes;
export default withModalMounter(injectIntl(EndMeetingButton));
