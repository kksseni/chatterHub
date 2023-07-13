package com.imlemica.chattyhub.repository;

import com.imlemica.chattyhub.domain.Role;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository for performing operations with roles and databases.
 */
public interface RoleRepository extends JpaRepository<Role, Long> {
    /**
     * Finds a role by the name which it is registered in the system.
     * @param name to find role
     * @return role that was found
     */
    Role findByName(String name);
}
