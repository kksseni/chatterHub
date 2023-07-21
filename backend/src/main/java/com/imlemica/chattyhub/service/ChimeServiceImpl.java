package com.imlemica.chattyhub.service;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.services.chime.AmazonChime;
import com.amazonaws.services.chime.model.*;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ChimeServiceImpl implements ChimeService {
    private final AmazonChime chime;

    public Attendee createAttendee(String meetingId, String userId) {
        CreateAttendeeResult attendee = chime.createAttendee(new CreateAttendeeRequest()
                .withExternalUserId(userId)
                .withMeetingId(meetingId));
        return attendee.getAttendee();
    }

    @Override
    public Meeting createMeeting() {
        chime.createMeeting(new CreateMeetingRequest());
        CreateMeetingResult account = chime.createMeeting(new CreateMeetingRequest()
                .withClientRequestToken("AXEXAMPLE")
                .withMediaRegion("us-east-2")
                .withExternalMeetingId("AXEXAMPLE"));

        return account.getMeeting();
    }

    @Override
    public GetMeetingResult isExist(String meetingId) {
        GetMeetingRequest meetingRequest = new GetMeetingRequest().withMeetingId(meetingId);
        GetMeetingResult meeting;
        try {
            meeting = chime.getMeeting(meetingRequest);
        } catch (AmazonServiceException ex) {
            throw new NotFoundException(String.format("Meeting with id %s does not exist", meetingId));
        }
        return meeting;
    }
}
