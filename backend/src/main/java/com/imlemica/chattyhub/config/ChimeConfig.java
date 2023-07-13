package com.imlemica.chattyhub.config;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.chime.AmazonChime;
import com.amazonaws.services.chime.AmazonChimeClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ChimeConfig {
    @Bean
    public AmazonChime chime(){
        BasicAWSCredentials creds = new BasicAWSCredentials("AKIA4M6UWAPSOFCING4Z",
                "Kty1cr9EPqs10VwlomdYx/r5x/YEyBx/o40zWFU+");

        AmazonChime chime = AmazonChimeClient.builder()
                .withCredentials(new AWSStaticCredentialsProvider(creds)).build();
        return chime;
    }
}
