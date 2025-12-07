package com.xrisk.backend.model;

public class UserProfile {
    private final String id;
    private final String displayName;
    private final String avatarUrl;
    private final int trustScore;

    public UserProfile(String id, String displayName, String avatarUrl, int trustScore) {
        this.id = id;
        this.displayName = displayName;
        this.avatarUrl = avatarUrl;
        this.trustScore = trustScore;
    }

    public String getId() {
        return id;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public int getTrustScore() {
        return trustScore;
    }
}
