package com.wizbee.backend.user.service;

import com.wizbee.backend.user.entity.User;
import com.wizbee.backend.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User findByMachine(String rassId) {
        return userRepository.findByMachine(rassId);
    }

    public User findById(int id){
        return userRepository.findById(id);
    }

    public User saveUser(User user){
        return userRepository.save(user);
    }

}
