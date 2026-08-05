import {Entity, JoinColumn, ManyToOne, PrimaryColumn} from "typeorm";
import {Topic} from "../../core-options/entities/topic.entity";
import {Event} from "./event.entity";

@Entity('event_topic')
export class EventTopic {
    @PrimaryColumn({name: 'id_event', type: 'uuid'})
    id_event: string;

    @PrimaryColumn({name: 'id_topic', type: 'uuid'})
    id_topic: string;

    @ManyToOne(
        () => Event,
        event => event["topics"],
        {onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'id_event', referencedColumnName: 'id' }])
    events?: Event[];

    @ManyToOne(
        () => Topic,
        topic => topic["events"],
        {onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'id_topic', referencedColumnName: 'id' }])
    topics?: Topic[];
}