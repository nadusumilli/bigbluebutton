import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { injectIntl } from 'react-intl';
import { withModalMounter } from '/imports/ui/components/modal/service';
import PollingButton from './component';

const PollingButtonContainer = (props) => {
  const {
    isPollingEnabled,
    intl,
    mountModal,
    ...restProps
  } = props;

  return (
    <PollingButton {...{
      isPollingEnabled, ...restProps,
    }}
    />
  );
};

export default withModalMounter(injectIntl(withTracker(() => ({
}))(PollingButtonContainer)));
