import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { injectIntl } from 'react-intl';
import { withModalMounter } from '/imports/ui/components/modal/service';
import UploadPresentationButton from './component';
import PresentationUploaderContainer from '/imports/ui/components/presentation/presentation-uploader/container';

const UploadPresentationContainer = (props) => {
  const {
    amIPresenter,
    intl,
    mountModal,
    ...restProps
  } = props;

  const mountUploadPresentation = () => {
    mountModal(<PresentationUploaderContainer />);
  };

  return (
    <UploadPresentationButton {...{
      amIPresenter, mountUploadPresentation, ...restProps,
    }}
    />
  );
};

export default withModalMounter(injectIntl(withTracker(() => ({
}))(UploadPresentationContainer)));
