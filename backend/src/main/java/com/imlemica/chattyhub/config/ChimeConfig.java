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
        BasicAWSCredentials creds = new BasicAWSCredentials(System.getenv("ACCESS_KEY"),
                System.getenv("SECRET_KEY"));

        AmazonChime chime = AmazonChimeClient.builder()
                .withCredentials(new AWSStaticCredentialsProvider(creds)).withRegion("us-east-1").build();
        return chime;
    }
}
