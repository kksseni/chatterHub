package com.imlemica.chattyhub.config;

import com.imlemica.chattyhub.domain.AppUser;
import com.imlemica.chattyhub.domain.Role;
import com.imlemica.chattyhub.repository.RoleRepository;
import com.imlemica.chattyhub.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
@AllArgsConstructor
public class UsersData {

    UserService userService;
    RoleRepository repository;

    @Bean
    public void addUsers(){
        Role role_user = repository.save(Role.builder().name("ROLE_USER").build());
        List<Role> roleList = List.of(role_user);
        userService.saveUser(AppUser.builder().name("admin").email("admin").roles(roleList).password("admin").build());
        userService.saveUser(AppUser.builder().name("user").email("user").roles(roleList).password("user").build());
        userService.saveUser(AppUser.builder().name("kseni").email("kseni").roles(roleList).password("kseni").build());
    }
}
