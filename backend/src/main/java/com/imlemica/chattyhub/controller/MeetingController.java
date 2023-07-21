package com.imlemica.chattyhub.controller;

import com.amazonaws.services.chime.model.Attendee;
import com.amazonaws.services.chime.model.GetMeetingResult;
import com.amazonaws.services.chime.model.Meeting;
import com.imlemica.chattyhub.domain.MeetConfigData;
import com.imlemica.chattyhub.service.ChimeService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/meeting")
@AllArgsConstructor
@Slf4j
public class MeetingController {
    private final ChimeService chimeService;

    @PostMapping(value = "/join", consumes = MediaType.MULTIPART_FORM_DATA_VALUE,  produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Attendee> joinMeet(@RequestPart String userId, @RequestPart(required = false) String meetingId) {
        Attendee attendee = chimeService.createAttendee(meetingId, userId);
        return new ResponseEntity<>(attendee, HttpStatus.OK);
    }

    @PostMapping(value = "/check",  produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Meeting> checkMeet(@RequestPart String meetingId) {
        Meeting meeting = chimeService.isExist(meetingId).getMeeting();
        return new ResponseEntity<>(meeting, HttpStatus.OK);
    }

    @GetMapping(value = "/create", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Meeting> joinMeet(){
        Meeting meeting = chimeService.createMeeting();
        return new ResponseEntity<>(meeting, HttpStatus.OK);
    }
}
