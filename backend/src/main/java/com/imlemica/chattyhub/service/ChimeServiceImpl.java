package com.imlemica.chattyhub.service;

import com.amazonaws.services.chime.AmazonChime;
import com.amazonaws.services.chime.model.*;
import com.imlemica.chattyhub.domain.MeetConfigData;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ChimeServiceImpl implements ChimeService {
    private final AmazonChime chime;

    public CreateAttendeeResult createAttendee(String meetingId, String userId) {
        CreateAttendeeResult attendee = chime.createAttendee(new CreateAttendeeRequest()
                .withExternalUserId(userId)
                .withMeetingId(meetingId));
        return attendee;
    }

    @Override
    public CreateMeetingResult createMeeting() {
        chime.createMeeting(new CreateMeetingRequest());
        CreateMeetingResult account = chime.createMeeting(new CreateMeetingRequest()
                .withClientRequestToken("AXEXAMPLE")
                .withMediaRegion("us-east-2")
                .withExternalMeetingId("AXEXAMPLE"));

        return account;
    }

    @Override
    public MeetConfigData joinMeeting(String meetingId, String userId) {
        Meeting meeting = new Meeting();
        if(meetingId == null){
            CreateMeetingResult createMeetingResult = createMeeting();
            meeting = createMeetingResult.getMeeting();
            meetingId = createMeetingResult.getMeeting().getMeetingId();
        }

        CreateAttendeeResult createAttendeeResult = createAttendee(meetingId, userId);
        Attendee attendee = createAttendeeResult.getAttendee();
        MeetConfigData configData = MeetConfigData.builder().attendee(attendee).meeting(meeting).build();

        return configData;
    }
}
