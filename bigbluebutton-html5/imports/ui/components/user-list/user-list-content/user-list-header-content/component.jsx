import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import ChatIcon from "../../chat-list-item/chat-icon/component"
// import ChatAvatar from "../../chat-list-item/chat-avatar/component"
// import ChatUnreadCounter from "../../chat-list-item/chat-unread-messages/component"
import Dropdown from '/imports/ui/components/dropdown/component';
import Button from '/imports/ui/components/button/component';
import DropdownTrigger from '/imports/ui/components/dropdown/trigger/component';
import DropdownContent from '/imports/ui/components/dropdown/content/component';
import DropdownList from '/imports/ui/components/dropdown/list/component';
import DropdownListItem from '/imports/ui/components/dropdown/list/item/component';
import withShortcutHelper from '/imports/ui/components/shortcut-help/service';
import ChatListItemContainer from '../../chat-list-item/container';
import { Session } from 'meteor/session';
import { intlShape, defineMessages } from 'react-intl';
import { styles } from '/imports/ui/components/user-list/user-list-content/user-list-header-content/styles';

const propTypes = {
    activeChats: PropTypes.arrayOf(String).isRequired,
    isPublicChat: PropTypes.func.isRequired,
    compact: PropTypes.bool,
    shortcuts: PropTypes.string,
    intl: intlShape.isRequired,
}

const CHAT_CONFIG = Meteor.settings.public.chat;
const CHAT_ENABLED = CHAT_CONFIG.enabled;
const PUBLIC_CHAT_ID = CHAT_CONFIG.public_id;

const defaultProps = {
    compact: false,
    shortcuts: ''
}

const intlMessages = defineMessages({
    actionsLabel: {
      id: 'app.actionsBar.actionsDropdown.actionsLabel',
      description: 'Actions button label',
    },
});

class UserListHeader extends PureComponent {
    constructor(props){
        super(props);
        this.activeChatRefs = []
        this.setSessionToUserList = this.setSessionToUserList.bind(this);
    }

    setSessionToUserList() {
        Session.set('idChatOpen', '');
        Session.set('openPanel','userlist');
    }

    renderChatItems = () => {
        const {
            activeChats,
            compact,
            isPublicChat,
        } = this.props;
    
        let index = -1;
    
        return activeChats.map(chat => (
            <DropdownListItem label={chat.name} ref={(node) => { this.activeChatRefs[index += 1] = node; }} key={chat.userId}>
                <div>
                    <ChatListItemContainer
                        isPublicChat={isPublicChat}
                        compact={compact}
                        chat={chat}
                        tabIndex={-1}
                        isSameTabEnabled={true}
                        activeChatId={chat.userId}
                    />
                </div>
            </DropdownListItem>
        ));
    }

    render() {
        const {
            activeChats, 
            shortcuts: OPEN_ACTIONS_AK,
            intl
        } = this.props;

        const renderChatItem = this.renderChatItems();

        return(
            <div className={styles.userListHeaderWrapper}>
                <span className={styles.chat}>
                    <Dropdown ref={(ref) => { this._dropdown = ref; }}>
                        <DropdownTrigger tabIndex={0} accessKey={OPEN_ACTIONS_AK}>
                            <Button
                                hideLabel
                                aria-label={intl.formatMessage(intlMessages.actionsLabel)}
                                className={styles.button}
                                label={intl.formatMessage(intlMessages.actionsLabel)}
                                icon="chat"
                                color="default"
                                ghost
                                size="lg"
                                onClick={() => null}
                            />
                        </DropdownTrigger>
                        <DropdownContent placement="bottom right">
                            <DropdownList>
                                {activeChats.length >= 1 && renderChatItem}
                            </DropdownList>
                        </DropdownContent>
                    </Dropdown>
                </span>
                <span
                    className={styles.participants}
                    data-test="chatButton"
                    role="button"
                    onClick={this.setSessionToUserList}
                >
                    <svg
                    version="1.0"
                    xmlns="http://www.w3.org/2000/svg"
                    width="25pt"
                    height="25pt"
                    viewBox="0 0 80.000000 80.000000"
                    preserveAspectRatio="xMidYMid meet"
                    >
                    <metadata>
                    Created by potrace 1.16, written by Peter Selinger 2001-2019
                    </metadata>
                    <g
                        transform="translate(0.000000,80.000000) scale(0.100000,-0.100000)"
                        fill="#000000"
                        stroke="none"
                    >
                        <path d="M312 660 c-20 -12 -50 -20 -78 -20 -37 0 -51 -5 -75 -29 -28 -28 -29
                    -33 -29 -119 0 -50 3 -92 8 -94 10 -4 42 -67 42 -83 0 -7 -15 -18 -32 -26 -18
                    -7 -50 -24 -70 -37 -32 -20 -38 -30 -38 -58 l0 -34 60 0 c53 0 60 -2 60 -20 0
                    -19 7 -20 240 -20 233 0 240 1 240 20 0 18 7 20 60 20 60 0 60 0 60 30 0 36
                    -27 62 -92 92 -26 12 -48 27 -48 34 0 15 32 78 43 82 9 5 9 174 -1 187 -24 33
                    -74 55 -125 55 -41 0 -58 5 -72 20 -25 28 -108 27 -153 0z m137 -26 c3 -5 18
                    -17 34 -27 26 -17 27 -21 27 -101 0 -65 -3 -85 -15 -90 -8 -3 -15 -15 -15 -26
                    0 -11 -7 -23 -15 -26 -11 -4 -15 -21 -15 -55 0 -37 4 -49 15 -49 8 0 24 -9 35
                    -20 12 -12 24 -19 29 -16 11 7 68 -30 81 -53 13 -26 30 -24 -205 -27 -219 -2
                    -229 -1 -214 27 12 23 69 60 80 53 5 -3 17 4 29 16 11 11 27 20 35 20 11 0 15
                    12 15 49 0 34 -4 51 -15 55 -8 3 -15 15 -15 26 0 11 -7 23 -15 26 -12 5 -15
                    25 -15 90 0 79 2 85 30 114 26 27 35 30 76 26 25 -2 49 -8 53 -12z m-189 -124
                    c0 -80 3 -102 15 -106 8 -4 15 -14 15 -24 0 -9 9 -29 20 -43 11 -14 20 -29 20
                    -34 0 -4 -27 -20 -59 -36 -33 -15 -73 -41 -89 -57 -25 -25 -39 -30 -77 -30
                    -43 0 -45 1 -35 21 7 11 41 34 76 51 56 26 64 33 64 57 0 16 -11 49 -25 75
                    -34 64 -36 168 -3 203 13 13 33 23 50 23 l28 0 0 -100z m344 79 c36 -21 36
                    -22 36 -89 0 -54 -5 -79 -25 -116 -14 -26 -25 -59 -25 -75 0 -24 8 -31 64 -57
                    35 -17 69 -40 76 -51 10 -20 8 -21 -35 -21 -38 0 -52 5 -77 30 -16 16 -56 42
                    -89 57 -32 16 -59 32 -59 36 0 5 9 20 20 34 11 14 20 34 20 43 0 10 7 21 16
                    24 13 5 15 22 12 106 -3 113 1 118 66 79z"
                        />
                    </g>
                    </svg>
                </span>
            </div>
        );
    }

}

UserListHeader.propTypes = propTypes;
UserListHeader.defaultProps = defaultProps;

export default withShortcutHelper(UserListHeader, 'openActions');