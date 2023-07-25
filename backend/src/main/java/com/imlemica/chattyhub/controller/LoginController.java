package com.imlemica.chattyhub.controller;

import com.imlemica.chattyhub.domain.AppUser;
import com.imlemica.chattyhub.domain.Login;
import com.imlemica.chattyhub.service.LoginService;
import com.imlemica.chattyhub.service.UserService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import static java.lang.String.format;

@RestController
@AllArgsConstructor
@Slf4j
public class LoginController {
    private final LoginService loginService;

    private final UserService userService;

    @PostMapping(value = "/login", consumes = MediaType.APPLICATION_JSON_VALUE,  produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<AppUser> login(@RequestBody Login login) {
        log.info(format("User with email %s try to do login", login.getEmail()));
        String token = loginService.doLogin(login.getEmail(),login.getPassword());
        AppUser user = userService.findUserByEmail(login.getEmail());
        user.setToken(token);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }
}
