package com.imlemica.chattyhub.service;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.auth.AWSCredentialsProviderChain;
import com.amazonaws.services.chime.AmazonChime;
import com.amazonaws.services.chime.model.*;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@AllArgsConstructor
@Slf4j
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
                .withClientRequestToken(UUID.randomUUID().toString())
                .withMediaRegion("us-east-2")
                .withExternalMeetingId(UUID.randomUUID().toString()));

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

    @Override
    public void deleteAttendee(String meetingId, String attendeeId) {
        chime.deleteAttendee(new DeleteAttendeeRequest().withAttendeeId(attendeeId).withMeetingId(meetingId));
        log.info("Delete attendee wit id = "+ attendeeId);
        ListAttendeesResult attendeesResult = chime.listAttendees(new ListAttendeesRequest().withMeetingId(meetingId));
        if (attendeesResult.getAttendees().size() == 0){
            chime.deleteMeeting(new DeleteMeetingRequest().withMeetingId(meetingId));
            log.info("Delete meeting wit id = "+ meetingId);
        }
    }
}
