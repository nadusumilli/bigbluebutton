import React from 'react';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import Button from '/imports/ui/components/button/component';
import Modal from '/imports/ui/components/modal/simple/component';
import { makeCall } from '/imports/ui/services/api';
import { styles } from './styles';


const intlMessages = defineMessages({
  endMeetingTitle: {
    id: 'app.endMeeting.title',
    description: 'end meeting title',
  },
  endMeetingDescription: {
    id: 'app.endMeeting.description',
    description: 'end meeting description',
  },
  leaveMeetingDescription: {
    id: 'app.leaveConfirmation.confirmDesc',
    description: 'Leave meeting description',
  },
  endMeetingLabel: {
    id: 'app.endMeeting.title',
    description: 'label for yes button for end meeting',
  },
  leaveMeetingLabel: {
    id: 'app.leaveConfirmation.confirmLabel',
    description: 'label for no button for end meeting',
  },
});

const propTypes = {
  intl: intlShape.isRequired,
  closeModal: PropTypes.func.isRequired,
  endMeeting: PropTypes.func.isRequired,
};

class EndMeetingComponent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.LOGOUT_CODE = '680';
    this.leaveMeeting = this.leaveMeeting.bind(this);
  }

  leaveMeeting() {
    makeCall('userLeftMeeting');
    // we don't check askForFeedbackOnLogout here,
    // it is checked in meeting-ended component
    Session.set('codeError', this.LOGOUT_CODE);
    // mountModal(<MeetingEndedComponent code={LOGOUT_CODE} />);
  }

  render() {
    const { intl, closeModal, endMeeting } = this.props;

    return (
      <Modal
        overlayClassName={styles.overlay}
        className={styles.modal}
        onRequestClose={closeModal}
        hideBorder
      >
        <div className={styles.container}>
          <div className={styles.buttonSections}>
            <div className={styles.endMeetingButton}>
              <Button
                data-test="confirmEndMeeting"
                color="primary"
                size="lg"
                className={styles.button}
                label={intl.formatMessage(intlMessages.endMeetingLabel)}
                onClick={endMeeting}
              />
              <p>{intl.formatMessage(intlMessages.endMeetingDescription)}</p>
            </div>
            <div className={styles.leaveMeetingButton}>
              <Button
                label={intl.formatMessage(intlMessages.leaveMeetingLabel)}
                className={styles.button}
                size="lg"
                onClick={this.leaveMeeting}
              />
              <p>{intl.formatMessage(intlMessages.leaveMeetingDescription)}</p>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

EndMeetingComponent.propTypes = propTypes;

export default injectIntl(EndMeetingComponent);
