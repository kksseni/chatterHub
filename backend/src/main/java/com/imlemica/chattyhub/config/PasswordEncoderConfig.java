package com.imlemica.chattyhub.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Configures password hashing interfaces.
 */
@Configuration
public class PasswordEncoderConfig {
    /**
     * Defines an interface for password hashing. {@link BCryptPasswordEncoder}
     * uses adaptive hash algorithm to store password.
     * @return customized PasswordEncoder
     */
    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
