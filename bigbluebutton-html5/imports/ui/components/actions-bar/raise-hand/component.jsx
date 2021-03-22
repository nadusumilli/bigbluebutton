import React from 'react';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import Button from '/imports/ui/components/button/component';
import PropTypes from 'prop-types';
import { styles } from '../styles';

const propTypes = {
  intl: intlShape.isRequired,
  setEmojiStatus: PropTypes.func.isRequired,
  user: PropTypes.shape({}).isRequired,
};

const intlMessages = defineMessages({
  raiseHandLabel: {
    id: 'app.actionsBar.emojiMenu.raiseHandLabel',
    description: 'Raise Hand Label.',
  },
});

const raiseHand = (setEmojiStatus, user) => {
  setEmojiStatus(user.userId, 'raiseHand');
};

const RaiseHandButton = ({ intl, setEmojiStatus, user }) => (
  <Button
    className={styles.button}
    icon="hand"
    label={intl.formatMessage(intlMessages.raiseHandLabel)}
    hideLabel
    color="default"
    ghost
    circle
    size="lg"
    onClick={() => raiseHand(setEmojiStatus, user)}
    id="end-meeting-button"
  />
);

RaiseHandButton.propTypes = propTypes;
export default injectIntl(RaiseHandButton);
