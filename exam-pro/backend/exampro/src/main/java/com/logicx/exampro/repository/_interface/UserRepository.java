package com.logicx.exampro.repository._interface;

import com.logicx.exampro.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {
    // These methods are automatically available:
    // - <S extends User> S save(S entity)
    // - <S extends User> List<S> saveAll(Iterable<S> entities)
    // - void deleteById(String id)
    // - void delete(User entity)
    // etc.
    Optional<User> findByUsername(String username);
}
