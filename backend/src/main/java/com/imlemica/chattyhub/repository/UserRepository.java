package com.imlemica.chattyhub.repository;

import com.imlemica.chattyhub.domain.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<AppUser, Long> {
    AppUser findByEmail(String email);
}
