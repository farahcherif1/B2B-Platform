import {Entity, JoinColumn, ManyToOne, PrimaryColumn} from "typeorm";
import {Language} from "../../core-options/entities/language.entity";
import {Event} from "./event.entity";

@Entity('event_language')
export class  EventLanguage{
    @PrimaryColumn({name: 'id_event', type: 'uuid'})
    id_event: string;

    @PrimaryColumn({name: 'id_language', type: 'uuid'})
    id_language: string;

    @ManyToOne(
        () => Event,
        event => event["languages"],
        {onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'id_event', referencedColumnName: 'id' }])
    events?: Event[];

    @ManyToOne(
        () => Language,
        language => language["events"],
        {onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'id_language', referencedColumnName: 'id' }])
    languages?: Language[];
}