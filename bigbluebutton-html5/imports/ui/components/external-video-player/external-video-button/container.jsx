import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { injectIntl } from 'react-intl';
import { withModalMounter } from '/imports/ui/components/modal/service';
import ExternalVideoButton from './component';
import ExternalVideoModal from '/imports/ui/components/external-video-player/modal/container';

const ExternalVideoButtonContainer = (props) => {
  const {
    isSharingVideo,
    intl,
    mountModal,
    ...restProps
  } = props;

  const mountExternalVideoModal = () => {
    mountModal(<ExternalVideoModal />);
  };

  return (
    <ExternalVideoButton {...{
      isSharingVideo, mountExternalVideoModal, ...restProps,
    }}
    />
  );
};

export default withModalMounter(injectIntl(withTracker(() => ({
}))(ExternalVideoButtonContainer)));
