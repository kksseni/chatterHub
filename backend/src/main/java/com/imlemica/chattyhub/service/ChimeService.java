package com.imlemica.chattyhub.service;

import com.amazonaws.services.chime.model.*;

public interface ChimeService {
    public Attendee createAttendee(String meetingId, String userId);

    public Meeting createMeeting();

    GetMeetingResult isExist(String meetingId);
}
