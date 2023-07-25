package com.imlemica.chattyhub.domain;

import lombok.*;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Collection;


@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Entity
@Builder
@Table(name = "app_use")
public class AppUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column
    String firstname;

    @Column
    String lastname;

    @Column
    String email;

    @Column
    String password;

    String token;

    @Column
    @ManyToMany(fetch = FetchType.EAGER)
    private Collection<Role> roles = new ArrayList<>();
}
