package com.wizbee.backend.user.repository;

import com.wizbee.backend.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    User findByMachine(String rassId);

    User findById(int id);

}

