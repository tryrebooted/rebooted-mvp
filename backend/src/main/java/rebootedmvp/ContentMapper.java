package rebootedmvp;

import org.springframework.stereotype.Component;

import rebootedmvp.domain.impl.ContentEntityImpl;

@Component
public class ContentMapper {
    public static Content toDomain(ContentEntityImpl entity) {
        return entity;
    }

    public static ContentEntityImpl toEntity(Content domain) {
        return new ContentEntityImpl(domain);
    }
}