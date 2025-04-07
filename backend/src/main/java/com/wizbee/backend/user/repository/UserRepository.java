package com.wizbee.backend.user.repository;

//import com.wizbee.backend.user.dto.UserResponseDto;
import com.wizbee.backend.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    User findByMachine(String rassId);

    User findById(int id);

    User findByEmail(String email);

//    @Query("SELECT u.name, u.birthday FROM User u WHERE u.id = :id")
//    UserResponseDto findLoginUserById(int id);
}

