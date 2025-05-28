package com.milkman.service;

import com.milkman.model.User;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import java.time.Duration;

@Service
@Primary
public class CachingUserLookupProxy implements  UserLookupService{
    private final UserLookupService realService;
    private final Cache<String, Optional<User>> userCache = Caffeine.newBuilder()
            // Evict entries 10 minutes after write
            .expireAfterWrite(Duration.ofMinutes(10))
            // Keep at most 10,000 entries (LRU eviction)
            .maximumSize(10_000)
            .build();

    private final Cache<String, Boolean> existsCache = Caffeine.newBuilder()
            .expireAfterWrite(Duration.ofMinutes(10))
            .maximumSize(10_000)
            .build();

    LoggerService logger = LoggerService.getInstance();

    public CachingUserLookupProxy(UserLookupService realService) {
        this.realService = realService;
    }

    @Override
    public Optional<User> findByUsername(String username) {
        Optional<User> result = userCache.get(username, realService::findByUsername);

        //TODO: Remove after testing
        boolean inCache = userCache.asMap().containsKey(username);
        String cacheLable = "miss";
        if (inCache) {
            cacheLable = "hit";
        }
        logger.logInfo("[UserLookupProxy] findByUsername(\" " + username + " \") – cache " +  cacheLable);
        return result;
    }

    @Override
    public Boolean existsByUsername(String username) {
        Boolean result = existsCache.get(username, realService::existsByUsername);

        //TODO: Remove after testing
        boolean inCache = existsCache.asMap().containsKey(username);
        String cacheLable = "miss";
        if (inCache) {
            cacheLable = "hit";
        }
        logger.logInfo("[UserLookupProxy] findByUsername(\" " + username + " \") – cache " +  cacheLable);
        return result;
    }
}
