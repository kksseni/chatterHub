package com.imlemica.chattyhub.service;

import com.amazonaws.services.chime.model.CreateAttendeeResult;
import com.amazonaws.services.chime.model.CreateMeetingResult;
import com.imlemica.chattyhub.domain.MeetConfigData;

public interface ChimeService {
    public CreateAttendeeResult createAttendee(String meetingId, String userId);

    public CreateMeetingResult createMeeting();
    public MeetConfigData joinMeeting(String meetingId, String userId);
}
