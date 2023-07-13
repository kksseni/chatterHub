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
        log.info("Saving new user {} to the database", user.getName());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepo.save(user);
    }

    /**
     * Finds a user by his name in the database calling method
     * {@link UserRepository#findByName(String)}.
     * @param username  name of the user to find user with all information about it
     */
    @Override
    public void findUserByName(String username) {
        log.info("Fetching user {}", username);
        userRepo.findByName(username);
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
     * @param username the username identifying the user whose data is required.
     * @return core user information
     * @throws UsernameNotFoundException If the user was not found in the database
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AppUser user = userRepo.findByName(username);
        if (user == null) {
            throw new UsernameNotFoundException(format("User with username %s does not exist", username));
        }
        log.info(format("User with username %s was found in the database", username));

        Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
        user.getRoles().forEach(role -> authorities.add(new SimpleGrantedAuthority(role.getName())));
        return new User(user.getName(), user.getPassword(), authorities);
    }
}
