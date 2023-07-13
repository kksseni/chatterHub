package com.imlemica.chattyhub.domain;

import lombok.*;

import javax.persistence.*;

/**
 * The Role represents the high-level roles of the user in the system.
 * Each role will have a set of low-level privileges.
 */
@Entity
@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Role {
    /**
     * Number of role.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    /**
     * Name for role.
     */
    @Column
    private String name;
}
