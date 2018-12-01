'use strict';

const RTCSessionDescription = require('@twilio/webrtc').RTCSessionDescription;

/**
 * Apply the workaround for missing H264 profile-level-id flag.
 * @param {RTCSessionDescriptionInit} description
 * @returns {RTCSessionDescription} newDescription
 */
function workaround(description) {
  const descriptionInit = {
    type: description.type,
    sdp: description.sdp.replace('42001f', '42e01f')
  };
  return new RTCSessionDescription(descriptionInit);
}

module.exports = workaround;
