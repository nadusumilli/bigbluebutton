import React, { PureComponent } from 'react';
import cx from 'classnames';
import { styles } from './styles.scss';
import DesktopShare from './desktop-share/component';
import RaiseHandButtonContainer from './raise-hand/container';
import QuickPollDropdown from './quick-poll-dropdown/component';
import AudioControlsContainer from '../audio/audio-controls/container';
import JoinVideoOptionsContainer from '../video-provider/video-button/container';
import UploadPresentationContainer from '../presentation/presentation-button/container';
import CaptionsButtonContainer from '/imports/ui/components/actions-bar/captions/container';
import PresentationOptionsContainer from './presentation-options/component';
import ExternalVideoButtonContainer from '../external-video-player/external-video-button/container';
import PollingButtonContainer from '../polling/polling-button/container';
import RecordingIndicator from './recording-indicator/container';
import EndMeetingButton from './end-meeting/component';
// import DropdownListItem from '/imports/ui/components/dropdown/list/item/component';

class ActionsBar extends PureComponent {
  render() {
    const {
      amIPresenter,
      handleShareScreen,
      handleUnshareScreen,
      isVideoBroadcasting,
      amIModerator,
      screenSharingCheck,
      enableVideo,
      isLayoutSwapped,
      toggleSwapLayout,
      intl,
      currentSlidHasContent,
      parseCurrentSlideContent,
      screenShareEndAlert,
      screenshareDataSavingSetting,
      isCaptionsAvailable,
      isMeteorConnected,
      isPollingEnabled,
      isThereCurrentPresentation,
      allowExternalVideo,
      mountModal,
    } = this.props;

    const actionBarClasses = {};

    actionBarClasses[styles.centerWithActions] = amIPresenter;
    actionBarClasses[styles.center] = true;
    actionBarClasses[styles.mobileLayoutSwapped] = isLayoutSwapped && amIPresenter;

    return (
      <div className={styles.actionsbar}>
        <div className={styles.left}>
          <EndMeetingButton amIModerator />

          {isPollingEnabled
            ? (
              <QuickPollDropdown
                {...{
                  currentSlidHasContent,
                  intl,
                  amIPresenter,
                  parseCurrentSlideContent,
                }}
              />
            ) : null
          }
          {isCaptionsAvailable
            ? (
              <CaptionsButtonContainer {...{ intl }} />
            )
            : null
          }
        </div>

        <div className={cx(actionBarClasses)}>
          {amIPresenter && <UploadPresentationContainer amIPresenter />}
          {amIPresenter && allowExternalVideo && <ExternalVideoButtonContainer isSharingVideo />}
          {amIPresenter && isPollingEnabled && <PollingButtonContainer isPollingEnabled />}
          {amIModerator
            && (
            <RecordingIndicator
              mountModal={mountModal}
              amIModerator={amIModerator}
            />
            )
          }
          <RaiseHandButtonContainer />
          <AudioControlsContainer />
          {enableVideo
            ? (
              <JoinVideoOptionsContainer />
            )
            : null}
          <DesktopShare {...{
            handleShareScreen,
            handleUnshareScreen,
            isVideoBroadcasting,
            amIPresenter,
            screenSharingCheck,
            screenShareEndAlert,
            isMeteorConnected,
            screenshareDataSavingSetting,
          }}
          />
        </div>
        <div className={styles.right}>
          {isLayoutSwapped
            ? (
              <PresentationOptionsContainer
                toggleSwapLayout={toggleSwapLayout}
                isThereCurrentPresentation={isThereCurrentPresentation}
              />
            )
            : null
          }
        </div>
      </div>
    );
  }
}

export default ActionsBar;
