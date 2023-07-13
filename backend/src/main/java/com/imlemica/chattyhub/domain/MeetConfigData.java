package com.imlemica.chattyhub.domain;

import com.amazonaws.services.chime.model.Attendee;
import com.amazonaws.services.chime.model.Meeting;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class MeetConfigData {
    Attendee attendee;
    Meeting meeting;
}
