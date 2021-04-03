import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import cx from 'classnames';
import _ from 'lodash';
import { styles } from './styles';
import VideoListItemContainer from './video-list-item/container';
import { withDraggableConsumer } from '../../media/webcam-draggable-overlay/context';
import AutoplayOverlay from '../../media/autoplay-overlay/component';
import logger from '/imports/startup/client/logger';
import playAndRetry from '/imports/utils/mediaElementPlayRetry';
import VideoService from '/imports/ui/components/video-provider/service';
import Button from '/imports/ui/components/button/component';

const propTypes = {
  streams: PropTypes.arrayOf(PropTypes.object).isRequired,
  onMount: PropTypes.func.isRequired,
  webcamDraggableDispatch: PropTypes.func.isRequired,
  intl: PropTypes.objectOf(Object).isRequired,
  swapLayout: PropTypes.bool.isRequired,
  numberOfPages: PropTypes.number.isRequired,
  currentVideoPageIndex: PropTypes.number.isRequired,
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const intlMessages = defineMessages({
  focusLabel: {
    id: 'app.videoDock.webcamFocusLabel',
  },
  focusDesc: {
    id: 'app.videoDock.webcamFocusDesc',
  },
  unfocusLabel: {
    id: 'app.videoDock.webcamUnfocusLabel',
  },
  unfocusDesc: {
    id: 'app.videoDock.webcamUnfocusDesc',
  },
  mirrorLabel: {
    id: 'app.videoDock.webcamMirrorLabel',
  },
  mirrorDesc: {
    id: 'app.videoDock.webcamMirrorDesc',
  },
  autoplayBlockedDesc: {
    id: 'app.videoDock.autoplayBlockedDesc',
  },
  autoplayAllowLabel: {
    id: 'app.videoDock.autoplayAllowLabel',
  },
  nextPageLabel: {
    id: 'app.video.pagination.nextPage',
  },
  prevPageLabel: {
    id: 'app.video.pagination.prevPage',
  },
});

const findOptimalGrid = (
  canvasWidth,
  canvasHeight,
  gutter,
  aspectRatio,
  numItems,
  columns = 1,
) => {
  const rows = Math.ceil(numItems / columns);
  const gutterTotalWidth = (columns - 1) * gutter;
  const gutterTotalHeight = (rows - 1) * gutter;
  const usableWidth = canvasWidth - gutterTotalWidth;
  const usableHeight = canvasHeight - gutterTotalHeight;
  let cellWidth = Math.floor(usableWidth / columns);
  let cellHeight = Math.ceil(cellWidth / aspectRatio);
  if (cellHeight * rows > usableHeight) {
    cellHeight = Math.floor(usableHeight / rows);
    cellWidth = Math.ceil(cellHeight * aspectRatio);
  }
  return {
    columns,
    rows,
    width: cellWidth * columns + gutterTotalWidth,
    height: cellHeight * rows + gutterTotalHeight,
    filledArea: cellWidth * cellHeight * numItems,
  };
};

const ASPECT_RATIO = 4 / 3;

class VideoList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      focusedId: false,
      focusedVideoWidth: '300',
      autoplayBlocked: false,
      mirroredCameras: [],
    };

    this.ticking = false;
    this.grid = null;
    this.canvas = null;
    this.failedMediaElements = [];
    this.handleCanvasResize = _.throttle(
      this.handleCanvasResize.bind(this),
      66,
      {
        leading: true,
        trailing: true,
      },
    );
    this.setOptimalGrid = this.setOptimalGrid.bind(this);
    this.handleAllowAutoplay = this.handleAllowAutoplay.bind(this);
    this.handlePlayElementFailed = this.handlePlayElementFailed.bind(this);
    this.autoplayWasHandled = false;
  }

  componentDidMount() {
    const { webcamDraggableDispatch } = this.props;
    webcamDraggableDispatch({
      type: 'setVideoListRef',
      value: this.grid,
    });

    this.handleCanvasResize();
    window.addEventListener('resize', this.handleCanvasResize, false);
    window.addEventListener('videoPlayFailed', this.handlePlayElementFailed);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleCanvasResize, false);
    window.removeEventListener('videoPlayFailed', this.handlePlayElementFailed);
  }

  setOptimalGrid() {
    const { streams } = this.props;
    const numItems = streams.length;
    if (numItems < 1 || !this.canvas || !this.grid) {
      return;
    }
    // const { focusedId } = this.state;
    // const focusedId = users && users.filter(user => user.emoji === 'spotlight').length > 0;
    const { height: canvasHeight } = this.canvas.getBoundingClientRect();
    const { height: gridHeight } = this.grid.getBoundingClientRect();
    const focusedVideoWidth = (canvasHeight - gridHeight - 15) * ASPECT_RATIO;
    // webcamDraggableDispatch(
    //   {
    //     type: 'setOptimalGrid',
    //     value: optimalGrid,
    //   },
    // );
    this.setState({
      focusedVideoWidth,
    });
  }

  getFocusedVideo() {
    return this.renderVideoList(true);
  }

  handleAllowAutoplay() {
    const { autoplayBlocked } = this.state;

    logger.info(
      {
        logCode: 'video_provider_autoplay_allowed',
      },
      'Video media autoplay allowed by the user',
    );

    this.autoplayWasHandled = true;
    window.removeEventListener('videoPlayFailed', this.handlePlayElementFailed);
    while (this.failedMediaElements.length) {
      const mediaElement = this.failedMediaElements.shift();
      if (mediaElement) {
        const played = playAndRetry(mediaElement);
        if (!played) {
          logger.error(
            {
              logCode: 'video_provider_autoplay_handling_failed',
            },
            'Video autoplay handling failed to play media',
          );
        } else {
          logger.info(
            {
              logCode: 'video_provider_media_play_success',
            },
            'Video media played successfully',
          );
        }
      }
    }
    if (autoplayBlocked) {
      this.setState({ autoplayBlocked: false });
    }
  }

  handlePlayElementFailed(e) {
    const { mediaElement } = e.detail;
    const { autoplayBlocked } = this.state;

    e.stopPropagation();
    this.failedMediaElements.push(mediaElement);
    if (!autoplayBlocked && !this.autoplayWasHandled) {
      logger.info(
        {
          logCode: 'video_provider_autoplay_prompt',
        },
        'Prompting user for action to play video media',
      );
      this.setState({ autoplayBlocked: true });
    }
  }

  handleVideoFocus(id) {
    const { focusedId } = this.state;
    this.setState(
      {
        focusedId: focusedId !== id ? id : false,
      },
      this.handleCanvasResize,
    );
    window.dispatchEvent(new Event('videoFocusChange'));
  }

  mirrorCamera(cameraId) {
    const { mirroredCameras } = this.state;
    if (this.cameraIsMirrored(cameraId)) {
      this.setState({
        mirroredCameras: mirroredCameras.filter(x => x !== cameraId),
      });
    } else {
      this.setState({
        mirroredCameras: mirroredCameras.concat([cameraId]),
      });
    }
  }

  cameraIsMirrored(cameraId) {
    const { mirroredCameras } = this.state;
    return mirroredCameras.indexOf(cameraId) >= 0;
  }

  handleCanvasResize() {
    if (!this.ticking) {
      window.requestAnimationFrame(() => {
        this.ticking = false;
        this.setOptimalGrid();
      });
    }
    this.ticking = true;
  }

  renderNextPageButton() {
    const { intl, numberOfPages, currentVideoPageIndex } = this.props;

    if (!VideoService.isPaginationEnabled() || numberOfPages <= 1) return null;

    const currentPage = currentVideoPageIndex + 1;
    const nextPageLabel = intl.formatMessage(intlMessages.nextPageLabel);
    const nextPageDetailedLabel = `${nextPageLabel} (${currentPage}/${numberOfPages})`;

    return (
      <Button
        role="button"
        aria-label={nextPageLabel}
        color="primary"
        icon="right_arrow"
        size="md"
        onClick={VideoService.getNextVideoPage}
        label={nextPageDetailedLabel}
        hideLabel
        className={cx(styles.nextPage)}
      />
    );
  }

  renderPreviousPageButton() {
    const { intl, currentVideoPageIndex, numberOfPages } = this.props;

    if (!VideoService.isPaginationEnabled() || numberOfPages <= 1) return null;

    const currentPage = currentVideoPageIndex + 1;
    const prevPageLabel = intl.formatMessage(intlMessages.prevPageLabel);
    const prevPageDetailedLabel = `${prevPageLabel} (${currentPage}/${numberOfPages})`;

    return (
      <Button
        role="button"
        aria-label={prevPageLabel}
        color="primary"
        icon="left_arrow"
        size="md"
        onClick={VideoService.getPreviousVideoPage}
        label={prevPageDetailedLabel}
        hideLabel
        className={cx(styles.previousPage)}
      />
    );
  }

  renderVideoList(getFocused = false) {
    const {
      intl, streams, onMount, swapLayout, users,
    } = this.props;
    const { focusedId, focusedVideoWidth } = this.state;

    const numOfStreams = streams.length;
    const filteredStreams = streams.filter((stream) => {
      const { userId } = stream;
      let enableSpotlight = false;
      if (getFocused) {
        if (users && users.length > 0) {
          const spotlightUsers = users.filter(
            user => user.emoji === 'spotlight',
          );

          if (spotlightUsers.length > 0) {
            enableSpotlight = spotlightUsers[0].extId === userId;
          }
        }
        return enableSpotlight;
      }
      if (users && users.length > 0) {
        const spotlightUsers = users.filter(
          user => user.emoji === 'spotlight',
        );

        if (spotlightUsers.length > 0) {
          enableSpotlight = spotlightUsers[0].extId !== userId;
        } else {
          return true;
        }
      }
      return enableSpotlight;
    });
    if (filteredStreams.length === 0) {
      return null;
    }

    users.sort((first, second) => second.loginTime - first.loginTime);

    const sortedStreams = [];
    users.forEach((user) => {
      const stream = filteredStreams.find(s => s.userId === user.extId);
      if (stream) {
        sortedStreams.push(stream);
      }
    });

    return sortedStreams.map((stream) => {
      const { cameraId, userId, name } = stream;
      const isFocused = focusedId === cameraId;
      this.handleCanvasResize();

      const isFocusedIntlKey = !isFocused ? 'focus' : 'unfocus';
      let actions = [];

      if (numOfStreams > 2) {
        actions = [
          {
            label: intl.formatMessage(intlMessages[`${isFocusedIntlKey}Label`]),
            description: intl.formatMessage(
              intlMessages[`${isFocusedIntlKey}Desc`],
            ),
            onClick: () => this.handleVideoFocus(cameraId),
          },
        ];
      }

      /*
            style={enableSpotlight && numOfStreams > 2 ? {
              gridColumn: `1 / span ${this.state.optimalGrid.columns}`,
              gridRow: `1 / span ${this.state.optimalGrid.rows}`
            } : {}}
            */
      const focusedVideoWidthtStyle = getFocused
        ? { width: focusedVideoWidth }
        : {};

      return (
        <div
          key={cameraId}
          className={cx({
            [styles.videoListItem]: !getFocused,
            [styles.focusedVideoListItem]: getFocused,
          })}
          style={focusedVideoWidthtStyle}
        >
          <VideoListItemContainer
            numOfStreams={numOfStreams}
            cameraId={cameraId}
            userId={userId}
            name={name}
            actions={actions}
            onMount={(videoRef) => {
              this.handleCanvasResize();
              onMount(cameraId, videoRef);
            }}
            swapLayout={swapLayout}
          />
        </div>
      );
    });
  }

  render() {
    const { streams, intl } = this.props;
    const { optimalGrid, autoplayBlocked } = this.state;

    const canvasClassName = cx({
      [styles.videoCanvas]: true,
    });

    const videoListClassName = cx({
      [styles.videoList]: true,
    });

    return (
      <div
        ref={(ref) => {
          this.canvas = ref;
        }}
        className={canvasClassName}
      >
        {this.renderPreviousPageButton()}

        {!streams.length ? null : (
          <div
            ref={(ref) => {
              this.grid = ref;
            }}
            className={videoListClassName}
            style={{
              width: `${optimalGrid.width}px`,
              height: `${optimalGrid.height}px`,
              gridTemplateColumns: `repeat(${optimalGrid.columns}, 1fr)`,
              gridTemplateRows: `repeat(${optimalGrid.rows}, 1fr)`,
            }}
          >
            {this.renderVideoList()}
          </div>
        )}
        {!autoplayBlocked ? null : (
          <AutoplayOverlay
            autoplayBlockedDesc={intl.formatMessage(
              intlMessages.autoplayBlockedDesc,
            )}
            autoplayAllowLabel={intl.formatMessage(
              intlMessages.autoplayAllowLabel,
            )}
            handleAllowAutoplay={this.handleAllowAutoplay}
          />
        )}

        {this.renderNextPageButton()}
      </div>
    );
  }
}

VideoList.propTypes = propTypes;

export default injectIntl(withDraggableConsumer(VideoList));
