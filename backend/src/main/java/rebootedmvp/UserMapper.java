package rebootedmvp;

import org.springframework.stereotype.Component;

import rebootedmvp.domain.impl.UserProfileImpl;

@Component
public class UserMapper {
    public static User toDomain(UserProfileImpl entity) {
        return entity;
    }

    public static UserProfileImpl toEntity(User domain) {
        return new UserProfileImpl(domain);
    }
}