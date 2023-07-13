package com.imlemica.chattyhub.filter;


import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.ServletException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;

import static java.util.Arrays.stream;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;
import static org.springframework.http.HttpStatus.FORBIDDEN;

/**
 *  Filter base class that aims to guarantee a single execution per request
 *  dispatch, on any servlet container. It provides a {@link #doFilterInternal}
 *  method with HttpServletRequest and HttpServletResponse arguments.
 */
@Slf4j
public class CustomAuthorizationFilter extends OncePerRequestFilter {
    /**
     * Constant containing the secret for signing the jwt token.
     */
    private static final String SECRET = System.getenv("SECRET");
    /**
     * Constant containing endpoint for authorization.
     */
    private static final String ENDPOINT_TO_LOGIN = "/login";
    /**
     * Constant containing the beginning of the authorization header.
     */
    private static final String AUTHORIZATION_HEADER_STARTS_WITH = "Bearer ";
    /**
     * Constant containing the message of unsuccessful passage through the filter.
     */
    private static final String ERROR_LOGGING_IN = "Error logging in {}";
    /**
     * Constant containing the error message.
     */
    private static final String ERROR_MES = "Error";


    @Override
    protected void doFilterInternal(javax.servlet.http.HttpServletRequest request, javax.servlet.http.HttpServletResponse response, javax.servlet.FilterChain filterChain) throws ServletException, IOException, ServletException {
        if (request.getServletPath().equals(ENDPOINT_TO_LOGIN)) {
            filterChain.doFilter(request, response);
        } else {
            String authorizationHeader = request.getHeader(AUTHORIZATION);
            if (authorizationHeader != null && authorizationHeader.startsWith(AUTHORIZATION_HEADER_STARTS_WITH)) {

                try {
                    // Checking the token for validity
                    String token = authorizationHeader.substring(AUTHORIZATION_HEADER_STARTS_WITH.length());
                    Algorithm algorithm = Algorithm.HMAC256(SECRET.getBytes());
                    JWTVerifier verifier = JWT.require(algorithm).build();
                    DecodedJWT decodedJWT = verifier.verify(token);

                    // Checking token owner roles
                    String username = decodedJWT.getSubject();
                    String[] roles = decodedJWT.getClaim("roles").asArray(String.class);
                    Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
                    stream(roles).forEach(role -> authorities.add(new SimpleGrantedAuthority(role)));

                    UsernamePasswordAuthenticationToken authenticationToken =
                            new UsernamePasswordAuthenticationToken(username, null, authorities);
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                    filterChain.doFilter(request, response);

                } catch (JWTVerificationException e) {
                    log.error(ERROR_LOGGING_IN, (Object) e.getStackTrace());
                    response.setHeader(ERROR_MES, e.getMessage());
                    response.setStatus(FORBIDDEN.value());
                }
            } else {
                filterChain.doFilter(request, response);
            }
        }
    }
}
