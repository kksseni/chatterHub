package com.imlemica.chattyhub.service;

import com.imlemica.chattyhub.domain.AppUser;
import com.imlemica.chattyhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import static java.lang.String.format;


@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class UserServiceImpl implements UserService, UserDetailsService {

    private final UserRepository userRepo;

    private final PasswordEncoder passwordEncoder;

    @Override
    public AppUser saveUser(AppUser user) {
        log.info("Saving new user {} to the database", user.getEmail());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepo.save(user);
    }

    @Override
    public AppUser findUserByEmail(String email) {
        log.info("Fetching user {}", email);
        return userRepo.findByEmail(email);
    }

    /**
     * Gets a list of all users from the database calling method
     * {@link UserRepository#findAll()}}.
     * @return list of all users
     */
    @Override
    public List<AppUser> getUsers() {
        log.info("Fetching all users");
        return userRepo.findAll();
    }

    /**
     * Searches for a user by his name. Used for authentication.
     * @param email the email identifying the user whose data is required.
     * @return core user information
     * @throws UsernameNotFoundException If the user was not found in the database
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        AppUser user = userRepo.findByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException(format("User with email %s does not exist", email));
        }
        log.info(format("User with email %s was found in the database", email));

        Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
        user.getRoles().forEach(role -> authorities.add(new SimpleGrantedAuthority(role.getName())));
        return new User(user.getEmail(), user.getPassword(), authorities);
    }
}
