package com.imlemica.chattyhub.service;

import com.imlemica.chattyhub.domain.AppUser;

import java.util.List;

/**
 * Service for performing operations with users.
 */
public interface UserService {

    AppUser saveUser(AppUser user);

    AppUser findUserByEmail(String username);

    List<AppUser> getUsers();
}
