import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { styles } from './styles';
import UserParticipantsContainer from './user-participants/container';
import ChatContainer from '/imports/ui/components/chat/container';
// import UserMessages from './user-messages/component';
import { Session } from 'meteor/session';
import UserNotesContainer from './user-notes/container';
import UserCaptionsContainer from './user-captions/container';
import WaitingUsers from './waiting-users/component';
import UserPolls from './user-polls/component';
import BreakoutRoomItem from './breakout-room/component';
import UserListHeader from "./user-list-header-content/component"

const propTypes = {
  activeChats: PropTypes.arrayOf(String).isRequired,
  compact: PropTypes.bool,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
  currentUser: PropTypes.shape({}).isRequired,
  isPublicChat: PropTypes.func.isRequired,
  setEmojiStatus: PropTypes.func.isRequired,
  roving: PropTypes.func.isRequired,
  pollIsOpen: PropTypes.bool.isRequired,
  forcePollOpen: PropTypes.bool.isRequired,
  requestUserInformation: PropTypes.func.isRequired,
};

const defaultProps = {
  compact: false,
};
const CHAT_ENABLED = Meteor.settings.public.chat.enabled;
const ROLE_MODERATOR = Meteor.settings.public.user.role_moderator;

class UserContent extends PureComponent {
  constructor(props){
    super(props);
    this.state = {
      renderChat: !!Session.get('idChatOpen')
    }
    this.updateRenderChat = this.updateRenderChat.bind(this);
  }

  updateRenderChat(id){
    console.log(id);
    this.setState({renderChat: !!id});
  }

  renderPaticipants(renderChat){
    const {
      pollIsOpen,
      forcePollOpen,
      hasBreakoutRoom,
      pendingUsers,
      requestUserInformation,
      currentUser,
      setEmojiStatus,
      intl,
      compact,
      roving,
    } = this.props;
    console.log("Hello There", renderChat);
    // if(renderChat) return null;
    return (
      <div className="participants">
          {currentUser.role === ROLE_MODERATOR
            ? (
              <UserCaptionsContainer
                {...{
                  intl,
                }}
              />
            ) : null
          }
          <UserNotesContainer
            {...{
              intl,
            }}
          />
          {pendingUsers.length > 0 && currentUser.role === ROLE_MODERATOR
            ? (
              <WaitingUsers
                {...{
                  intl,
                  pendingUsers,
                }}
              />
            ) : null
          }
          <UserPolls
            isPresenter={currentUser.presenter}
            {...{
              pollIsOpen,
              forcePollOpen,
            }}
          />
          <BreakoutRoomItem isPresenter={currentUser.presenter} hasBreakoutRoom={hasBreakoutRoom} />
          <UserParticipantsContainer
            {...{
              compact,
              intl,
              currentUser,
              setEmojiStatus,
              roving,
              requestUserInformation,
            }}
          /> 
        </div>
    )
  }

  render() {
    const {
      compact,
      intl,
      roving,
      isPublicChat,
      activeChats,
    } = this.props;
    const {renderChat} = this.state

    const renderParts = this.renderPaticipants(renderChat);

    return (
      <div
        dir="ltr"
        data-test="userListContent"
        className={styles.content}
        role="complementary"
      >
        <UserListHeader updateRenderChat={this.updateRenderChat} {...{
              ...(CHAT_ENABLED && {isPublicChat}),
              ...(CHAT_ENABLED && {activeChats}),
              ...(CHAT_ENABLED && {compact}),
              intl,
              roving
            }}
        />
        <hr className={styles.headerDivider}/>
        {/* {CHAT_ENABLED
          ? (<UserMessages
            {...{
              isPublicChat,
              activeChats,
              compact,
              intl,
              roving,
            }}
          />
          ) : null
        } */}
        {renderChat ? <ChatContainer /> : null}
        {renderParts}
      </div>
    );
  }
}

UserContent.propTypes = propTypes;
UserContent.defaultProps = defaultProps;

export default UserContent;
