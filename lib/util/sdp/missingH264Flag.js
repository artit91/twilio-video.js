'use strict';

const RTCSessionDescription = require('@twilio/webrtc').RTCSessionDescription;

function forceH264forSDP(sdp) {
  const h264regex = /^a=rtpmap:(\d+) H264\/(?:\d+)/mg;
  let h264match = h264regex.exec(sdp);
  const h264ids = [];
  while (null !== h264match) {
    h264ids.push(h264match[1]);
    h264match = h264regex.exec(sdp);
  }
  const myregexp = /(m=video 9 UDP\/TLS\/RTP\/SAVPF )(\d+(?: \d+)+)/;
  sdp = sdp.replace(myregexp, function(match, p1, p2) {
      let i;
      let others = p2.split(' ');
      for (i = 0; i < h264ids.length; i += 1) {
          // eslint-disable-next-line
          others = others.filter(e => e !== h264ids[i]);
      }
      return p1 + h264ids.join(' ') + ' ' + others.join(' ');
  });
  return sdp;
}

/**
 * Force H264 and apply a workaround for missing H264 profile-level-id flag.
 * @param {RTCSessionDescriptionInit} description
 * @returns {RTCSessionDescription} newDescription
 */
function workaround(description) {
  const descriptionInit = {
    type: description.type,
    sdp: forceH264forSDP(description.sdp).replace('42001f', '42e01f')
  };
  return new RTCSessionDescription(descriptionInit);
}

module.exports = workaround;
