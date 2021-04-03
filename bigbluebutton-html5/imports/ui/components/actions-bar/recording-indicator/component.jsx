import React, { PureComponent, Fragment } from 'react';
import RecordingContainer from '/imports/ui/components/recording/container';
import { withModalMounter } from '/imports/ui/components/modal/service';
import humanizeSeconds from '/imports/utils/humanizeSeconds';
import Tooltip from '/imports/ui/components/tooltip/component';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import { styles } from './styles';
import Button from '../../button/component';

const intlMessages = defineMessages({
  notificationRecordingStart: {
    id: 'app.notification.recordingStart',
    description: 'Notification for when the recording starts',
  },
  notificationRecordingStop: {
    id: 'app.notification.recordingStop',
    description: 'Notification for when the recording stops',
  },
  recordingAriaLabel: {
    id: 'app.notification.recordingAriaLabel',
    description: 'Notification for when the recording stops',
  },
  startTitle: {
    id: 'app.recording.startTitle',
    description: 'start recording title',
  },
  stopTitle: {
    id: 'app.recording.stopTitle',
    description: 'stop recording title',
  },
  resumeTitle: {
    id: 'app.recording.resumeTitle',
    description: 'resume recording title',
  },
  recordingIndicatorOn: {
    id: 'app.navBar.recording.on',
    description: 'label for indicator when the session is being recorded',
  },
  recordingIndicatorOff: {
    id: 'app.navBar.recording.off',
    description: 'label for indicator when the session is not being recorded',
  },
  emptyAudioBrdige: {
    id: 'app.navBar.emptyAudioBrdige',
    description: 'message for notification when recording starts with no users in audio bridge',
  },
});

const propTypes = {
  intl: intlShape.isRequired,
  amIModerator: PropTypes.bool,
  record: PropTypes.bool,
  recording: PropTypes.bool,
  mountModal: PropTypes.func.isRequired,
  time: PropTypes.number,
  allowStartStopRecording: PropTypes.bool.isRequired,
};

const defaultProps = {
  amIModerator: false,
  record: false,
  recording: false,
  time: 0,
};

class RecordingIndicator extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      time: (props.time ? props.time : 0),
    };

    this.incrementTime = this.incrementTime.bind(this);
  }

  componentDidUpdate() {
    const { recording } = this.props;
    if (!recording) {
      clearInterval(this.interval);
      this.interval = null;
    } else if (this.interval === null) {
      this.interval = setInterval(this.incrementTime, 1000);
    }
  }

  incrementTime() {
    const { time: propTime } = this.props;
    const { time } = this.state;

    if (propTime > time) {
      this.setState({ time: propTime + 1 });
    } else {
      this.setState({ time: time + 1 });
    }
  }

  render() {
    const {
      record,
      recording,
      mountModal,
      amIModerator,
      intl,
      allowStartStopRecording,
      notify,
      micUser,
    } = this.props;

    const { time } = this.state;
    if (!record) return null;

    if (!this.interval && recording) {
      this.interval = setInterval(this.incrementTime, 1000);
    }

    const title = intl.formatMessage(recording ? intlMessages.recordingIndicatorOn
      : intlMessages.recordingIndicatorOff);

    let recordTitle = '';
    if (!recording) {
      recordTitle = time > 0
        ? intl.formatMessage(intlMessages.resumeTitle)
        : intl.formatMessage(intlMessages.startTitle);
    } else {
      recordTitle = intl.formatMessage(intlMessages.stopTitle);
    }

    const recordingToggle = () => {
      if (!micUser) {
        notify(intl.formatMessage(intlMessages.emptyAudioBrdige), 'error', 'warning');
      }
      mountModal(<RecordingContainer amIModerator={amIModerator} />);
      document.activeElement.blur();
    };

    const showButton = amIModerator && allowStartStopRecording;

    const recordMeetingButton = (
      <div
        aria-label={title}
        className={recording ? styles.recordingControlON : styles.recordingControlOFF}
        role="button"
        tabIndex={0}
        key="recording-toggle"
      >
        <Button
          icon="record"
          label={recordTitle}
          circle
          ghost
          color="default"
          size="lg"
          hideLabel
          className={styles.button}
          onClick={recordingToggle}
          onKeyPress={recordingToggle}
        />
      </div>
    );

    const recordMeetingButtonWithTooltip = (
      <Tooltip title={intl.formatMessage(intlMessages.stopTitle)}>
        {recordMeetingButton}
      </Tooltip>
    );

    const recordingButton = recording ? recordMeetingButtonWithTooltip : recordMeetingButton;

    return (
      <Fragment>
        <div className={styles.recordingIndicator}>
          {showButton
            ? recordingButton
            : null}

          {showButton ? null : (
            <Tooltip
              title={`${intl.formatMessage(recording
                ? intlMessages.notificationRecordingStart
                : intlMessages.notificationRecordingStop)}`}
            >
              <div
                aria-label={`${intl.formatMessage(recording
                  ? intlMessages.notificationRecordingStart
                  : intlMessages.notificationRecordingStop)}`}
                className={styles.recordingStatusViewOnly}
              >
                <Button
                  icon="record"
                  label={recordTitle}
                  circle
                  ghost
                  color="default"
                  size="lg"
                  hideLabel
                  className={styles.button}
                  onClick={recordingToggle}
                  onKeyPress={recordingToggle}
                />
                {recording
                  ? <div className={styles.presentationTitle}>{humanizeSeconds(time)}</div> : null}
              </div>
            </Tooltip>
          )}
        </div>
      </Fragment>
    );
  }
}

RecordingIndicator.propTypes = propTypes;
RecordingIndicator.defaultProps = defaultProps;

export default withModalMounter(injectIntl(RecordingIndicator));
