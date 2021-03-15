import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { withModalMounter } from '/imports/ui/components/modal/service';
import withShortcutHelper from '/imports/ui/components/shortcut-help/service';
import { defineMessages, injectIntl } from 'react-intl';
import Icon from '../icon/component';
import { styles } from './styles.scss';
import Button from '../button/component';
import SettingsDropdownContainer from './settings-dropdown/container';


const intlMessages = defineMessages({
  toggleUserListLabel: {
    id: 'app.navBar.userListToggleBtnLabel',
    description: 'Toggle button label',
  },
  toggleUserListAria: {
    id: 'app.navBar.toggleUserList.ariaLabel',
    description: 'description of the lists inside the userlist',
  },
  newMessages: {
    id: 'app.navBar.toggleUserList.newMessages',
    description: 'label for toggleUserList btn when showing red notification',
  },
});

const propTypes = {
  presentationTitle: PropTypes.string,
  hasUnreadMessages: PropTypes.bool,
};

const defaultProps = {
  presentationTitle: 'Default Room Title',
  hasUnreadMessages: false,
};

class NavBar extends PureComponent {
  static handleToggleUserList() {
    let panelName = Session.get('openPanel');
    if(panelName === 'chat' || panelName === 'userList'){
      Session.set('openPanel', '')
      Session.set('idChatOpen', '');
    }
    else{
      Session.set('openPanel', Session.get('openPanel')  || 'userlist');
    }
    // Session.set('idChatOpen', '');
  }

  render() {
    const {
      hasUnreadMessages,
      isExpanded,
      intl,
      presentationTitle,
      amIModerator,
    } = this.props;


    const toggleBtnClasses = {};
    toggleBtnClasses[styles.btn] = true;
    toggleBtnClasses[styles.btnWithNotificationDot] = hasUnreadMessages;

    let ariaLabel = intl.formatMessage(intlMessages.toggleUserListAria);
    ariaLabel += hasUnreadMessages ? (` ${intl.formatMessage(intlMessages.newMessages)}`) : '';

    return (
      <div className={styles.navbar}>
        <div className={styles.top}>
          <div className={styles.left}>
            {!isExpanded ? null
              : <Icon iconName="right_arrow" className={styles.arrowRight} />
            }
            <Button
              data-test="userListToggleButton"
              onClick={NavBar.handleToggleUserList}
              ghost
              circle
              hideLabel
              label={intl.formatMessage(intlMessages.toggleUserListLabel)}
              aria-label={ariaLabel}
              icon="user"
              className={cx(toggleBtnClasses)}
              aria-expanded={isExpanded}
              // accessKey={TOGGLE_USERLIST_AK}
            />
            {isExpanded ? null
              : <Icon iconName="left_arrow" className={styles.arrowLeft} />
            }
          </div>
          <div className={styles.center}>
            <h1 className={styles.presentationTitle}>{presentationTitle}</h1>
          </div>
          <div className={styles.right}>
            <svg
              version="1.0"
              xmlns="http://www.w3.org/2000/svg"
              width="50pt"
              height="30pt"
              viewBox="0 0 163.000000 67.000000"
              preserveAspectRatio="xMidYMid meet"
            >
              <metadata>
              Created by potrace 1.16, written by Peter Selinger 2001-2019
              </metadata>
              <g
                transform="translate(0.000000,67.000000) scale(0.100000,-0.100000)"
                fill="#000000"
                stroke="none"
              >
                <path d="M206 530 c-62 -19 -126 -113 -126 -186 0 -37 29 -107 58 -138 75 -80
              222 -73 295 13 31 37 41 82 35 155 -10 120 -134 194 -262 156z m165 -51 c37
              -26 59 -78 59 -139 0 -90 -50 -147 -138 -156 -94 -9 -162 55 -162 153 0 55 20
              112 46 134 49 40 144 44 195 8z"
                />
                <path d="M184 387 c-3 -8 -4 -36 -2 -63 l3 -49 58 -3 c35 -2 64 2 73 9 11 9
              18 9 29 -1 25 -21 36 1 33 61 l-3 54 -93 3 c-74 3 -93 1 -98 -11z"
                />
                <path d="M632 519 c-113 -56 -138 -237 -45 -321 59 -54 165 -63 231 -21 23 15
              42 31 42 36 0 20 -31 16 -66 -8 -32 -22 -47 -26 -83 -22 -139 15 -192 197 -83
              289 48 40 95 44 153 14 38 -19 50 -22 58 -12 8 9 6 17 -7 29 -46 42 -134 49
              -200 16z"
                />
                <path d="M880 515 c0 -10 16 -15 63 -17 l62 -3 3 -167 c2 -160 3 -168 22 -168
              19 0 20 7 20 170 l0 170 60 0 c47 0 60 3 60 15 0 13 -23 15 -145 15 -120 0
              -145 -2 -145 -15z"
                />
                <path d="M1331 508 c-6 -13 -41 -95 -80 -183 -38 -88 -66 -164 -62 -168 15
              -15 37 4 52 46 l16 42 79 5 c96 6 124 2 131 -19 18 -56 29 -71 50 -71 25 0 24
              3 -15 90 -11 25 -43 97 -71 160 -38 87 -55 116 -71 118 -13 2 -23 -4 -29 -20z
              m74 -129 l34 -84 -76 -3 c-41 -2 -77 -1 -79 1 -2 2 13 45 33 95 21 50 41 88
              45 84 5 -5 24 -46 43 -93z"
                />
              </g>
            </svg>
            <SettingsDropdownContainer amIModerator={amIModerator} />
          </div>
        </div>
        {/* <div className={styles.bottom}>
          <TalkingIndicatorContainer amIModerator={amIModerator} />
        </div> */}
      </div>
    );
  }
}

NavBar.propTypes = propTypes;
NavBar.defaultProps = defaultProps;
export default withShortcutHelper(withModalMounter(injectIntl(NavBar)), 'toggleUserList');
