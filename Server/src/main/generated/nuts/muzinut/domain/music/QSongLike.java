package nuts.muzinut.domain.music;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QSongLike is a Querydsl query type for SongLike
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QSongLike extends EntityPathBase<SongLike> {

    private static final long serialVersionUID = 1031516799L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QSongLike songLike = new QSongLike("songLike");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final DatePath<java.time.LocalDate> likeDt = createDate("likeDt", java.time.LocalDate.class);

    public final QSong song;

    public final nuts.muzinut.domain.member.QUser user;

    public QSongLike(String variable) {
        this(SongLike.class, forVariable(variable), INITS);
    }

    public QSongLike(Path<? extends SongLike> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QSongLike(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QSongLike(PathMetadata metadata, PathInits inits) {
        this(SongLike.class, metadata, inits);
    }

    public QSongLike(Class<? extends SongLike> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.song = inits.isInitialized("song") ? new QSong(forProperty("song"), inits.get("song")) : null;
        this.user = inits.isInitialized("user") ? new nuts.muzinut.domain.member.QUser(forProperty("user"), inits.get("user")) : null;
    }

}

