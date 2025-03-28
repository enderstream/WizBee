package com.wizbee.backend.user.service;


import com.wizbee.backend.user.dto.CustomOAuth2User;
import com.wizbee.backend.user.dto.GoogleResponse;
import com.wizbee.backend.user.dto.OAuth2Response;
import com.wizbee.backend.user.dto.UserDTO;
import com.wizbee.backend.user.entity.User;
import com.wizbee.backend.user.repository.UserRepository;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    public CustomOAuth2UserService(UserRepository userRepository) {

        this.userRepository = userRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        OAuth2User oAuth2User = super.loadUser(userRequest);
//        System.out.println(oAuth2User);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        OAuth2Response oAuth2Response = null;
        if (registrationId.equals("google")) {
            oAuth2Response = new GoogleResponse(oAuth2User.getAttributes());
        }
        else {
            return null;
        }
        String email = oAuth2Response.getEmail();
        // db에 해당 유저가 있는가(즉, 한 번이라도 우리 서비스를 이용해본 적이 있는가)
        User existData = userRepository.findByEmail(email);

        if (existData == null) {

            User userEntity = new User();
            userEntity.setEmail(oAuth2Response.getEmail());
            userEntity.setName(oAuth2Response.getName());
            userEntity.setImageUrl(oAuth2Response.getImgUrl());
            userEntity.setRole("NO_BIRTH_USER");

            User savedUser = userRepository.save(userEntity);

            UserDTO userDTO = new UserDTO();
            userDTO.setId(savedUser.getId());
            userDTO.setEmail(oAuth2Response.getEmail());
            userDTO.setName(oAuth2Response.getName());
            userDTO.setRole("NO_BIRTH_USER");

            return new CustomOAuth2User(userDTO);
        }
        else {

            existData.setEmail(oAuth2Response.getEmail());
            existData.setName(oAuth2Response.getName());

            User updatedUser = userRepository.save(existData);

            UserDTO userDTO = new UserDTO();
            userDTO.setId(updatedUser.getId());
            userDTO.setEmail(oAuth2Response.getEmail());
            userDTO.setName(oAuth2Response.getName());
            userDTO.setRole(existData.getRole());

            return new CustomOAuth2User(userDTO);
        }
    }
}