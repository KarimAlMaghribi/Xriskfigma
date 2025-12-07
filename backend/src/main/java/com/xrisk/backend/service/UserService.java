package com.xrisk.backend.service;

import com.xrisk.backend.model.UserProfile;
import jakarta.annotation.PostConstruct;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final Map<String, UserProfile> users = new ConcurrentHashMap<>();
    private static final String DEFAULT_USER_ID = "current-user";

    @PostConstruct
    public void seedUsers() {
        users.put(DEFAULT_USER_ID, new UserProfile(DEFAULT_USER_ID, "Alice Adventurer", "https://example.com/avatar/alice.png", 84));
        users.put("owner-1", new UserProfile("owner-1", "Oliver Owner", "https://example.com/avatar/oliver.png", 92));
        users.put("broker-1", new UserProfile("broker-1", "Brenda Broker", "https://example.com/avatar/brenda.png", 76));
    }

    public Optional<UserProfile> findById(String id) {
        return Optional.ofNullable(users.get(id));
    }

    public UserProfile getCurrentUser() {
        return users.get(DEFAULT_USER_ID);
    }
}
