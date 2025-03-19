package com.ephyris.ephyris_engine.Entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@ToString
@NoArgsConstructor
@Getter
@Setter
@AllArgsConstructor
@Entity // a class that represents a table in a relational database
@Table(name = "Users")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // This automatically populates this field in this case since
                                                        // the type is IDENTITY it will be equal to the table row the
                                                        // user is placed in
    Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    String name;

    @Column(nullable = false)
    String password;

    @Column(nullable = false)
    LocalDateTime createdAt;

    @Column(nullable = true)
    private String profileImage;

    @Column(nullable = false)
    private String membershipStatus;

    @ToString.Exclude
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Workout> workouts;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public String getUsername() {
        return email;
    }
}
