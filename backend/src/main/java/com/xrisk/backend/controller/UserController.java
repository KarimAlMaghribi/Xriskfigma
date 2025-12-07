package com.xrisk.backend.controller;

import com.xrisk.backend.dto.UserSummary;
import com.xrisk.backend.model.UserProfile;
import com.xrisk.backend.service.UserService;
import java.util.Optional;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<UserSummary> getUser(@PathVariable String id) {
        Optional<UserProfile> user = userService.findById(id);
        return user.map(profile -> ResponseEntity.ok(toSummary(profile)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/me")
    public UserSummary getCurrentUser() {
        return toSummary(userService.getCurrentUser());
    }

    private UserSummary toSummary(UserProfile profile) {
        UserSummary summary = new UserSummary();
        summary.setId(profile.getId());
        summary.setDisplayName(profile.getDisplayName());
        summary.setAvatarUrl(profile.getAvatarUrl());
        summary.setTrustScore(profile.getTrustScore());
        return summary;
    }
}
