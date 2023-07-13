package com.imlemica.chattyhub.controller;

import com.imlemica.chattyhub.domain.MeetConfigData;
import com.imlemica.chattyhub.service.ChimeService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/meeting")
@AllArgsConstructor
@Slf4j
public class MeetingController {
    private final ChimeService chimeService;

    @PostMapping(value = "/join", consumes = MediaType.MULTIPART_FORM_DATA_VALUE,  produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<MeetConfigData> joinMeet(@RequestPart String userId, @RequestPart(required = false) String meetingId) {
        MeetConfigData meetConfigData = chimeService.joinMeeting(meetingId, userId);
        return new ResponseEntity<>(meetConfigData, HttpStatus.OK);
    }
}
