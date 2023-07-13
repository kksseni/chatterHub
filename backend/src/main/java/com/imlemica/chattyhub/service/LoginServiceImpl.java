package com.imlemica.chattyhub.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class LoginServiceImpl implements LoginService{

    @Value("${token.lifetime}")
    private Integer tokenLifeTime;

    private final AuthenticationManager authenticationManager;

    private static final String SECRET = System.getenv("SECRET");

    private static final String ENDPOINT_TO_LOGIN = "/login";

    public String doLogin(String username, String password) {
        log.info("Username is:{}", username);
        log.info("Password is:{}", password);

        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(username.toLowerCase(), password);
        Authentication authenticate = authenticationManager.authenticate(authenticationToken);

        return successfulAuthentication(authenticate);
    }

    public String successfulAuthentication(Authentication authResult) {
        User user = (User) authResult.getPrincipal();
        Algorithm algorithm = Algorithm.HMAC256(SECRET.getBytes());

        String access_token = JWT.create()
                .withSubject(user.getUsername())
                .withExpiresAt(new Date(System.currentTimeMillis() + tokenLifeTime))
                .withIssuer(ENDPOINT_TO_LOGIN)
                .withClaim("roles", user.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority).collect(Collectors.toList()))
                .sign(algorithm);
        log.info("Access token was created");
        return access_token;
    }
}

