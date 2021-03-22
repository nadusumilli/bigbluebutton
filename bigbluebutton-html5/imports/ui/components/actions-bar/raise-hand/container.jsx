import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import RaiseHandButton from './component';
import Service from '../service';
import Users from '/imports/api/users';
import Auth from '/imports/ui/services/auth';

const RaiseHandButtonContainer = props => <RaiseHandButton {...props} />;

export default withTracker(() => ({
  user: Users.findOne({ userId: Auth.userID }, {
    fields: {
      userId: 1,
      role: 1,
      guest: 1,
      locked: 1,
      presenter: 1,
    },
  }),
  setEmojiStatus: Service.setEmojiStatus,
}))(RaiseHandButtonContainer);
