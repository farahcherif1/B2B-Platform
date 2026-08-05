// import { Test, TestingModule } from '@nestjs/testing';
// import { EventController } from './event.controller';
// import { EventService } from './event.service';
// import { CreateEventDto } from './dto/create-event.dto';
// import { UpdateEventDto } from './dto/update-event.dto';
//
// describe('EventController', () => {
//   let controller: EventController;
//   let service: EventService;
//
//   const mockEventService = {
//     create: jest.fn((dto: CreateEventDto) => {
//       return { id: 1, ...dto };
//     }),
//     findAll: jest.fn(() => [
//       { id: 1, name: 'Event 1' , path : 'path', startDate : new Date('2017-03-15T10:24:36Z'), endDate : new Date('2017-03-15T10:24:36Z'), timezone : 'UTC', language : 'English', topic : 'topic'},
//       { id: 2, name: 'Event 2', path: 'path', startDate : new Date('2017-03-15T10:24:36Z'), endDate : new Date('2017-03-15T10:24:36Z'), timezone : 'UTC', language : 'English', topic : 'topic' },
//     ]),
//     findOne: jest.fn((id: number) => {
//       return { id, name: `Event ${id}` };
//     }),
//     update: jest.fn((id: number, dto: UpdateEventDto) => {
//       return { id, ...dto };
//     }),
//     remove: jest.fn((id: number) => {
//       return { message: `Event with id ${id} removed` };
//     }),
//   };
//
//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [EventController],
//       providers: [
//         {
//           provide: EventService,
//           useValue: mockEventService,
//         },
//       ],
//     }).compile();
//     //@ts-ignore
//     controller = module.get<EventController>(EventController);
//     //@ts-ignore
//     service = module.get<EventService>(EventService);
//   });
//
//   it('should be defined', () => {
//     expect(controller).toBeDefined();
//   });
//
//   describe('create', () => {
//     it('should create a new event', () => {
//       const dto: CreateEventDto = { id : 3,name: 'New Event', endDate : new Date(), language : 'English', path : 'path', startDate : new Date(), timezone : 'UTC', topic : 'topic' };
//       expect(controller.create(dto)).toEqual({ id: 1, ...dto });
//       expect(service.create).toHaveBeenCalledWith(dto);
//     });
//   });
//
//   describe('findAll', () => {
//     it('should return all events', () => {
//       expect(controller.findAll()).toEqual([
//         { id: 1, name: 'Event 1' , path : 'path', startDate : new Date('2017-03-15T10:24:36Z'), endDate : new Date('2017-03-15T10:24:36Z'), timezone : 'UTC', language : 'English', topic : 'topic'},
//         { id: 2, name: 'Event 2' , path : 'path', startDate : new Date('2017-03-15T10:24:36Z'), endDate : new Date('2017-03-15T10:24:36Z'), timezone : 'UTC', language : 'English', topic : 'topic'},
//
//       ]);
//       expect(service.findAll).toHaveBeenCalled();
//     });
//   });
//
//   describe('findOne', () => {
//     it('should return a single event', () => {
//       expect(controller.findOne('1')).toEqual({ id: 1, name: 'Event 1' });
//       expect(service.findOne).toHaveBeenCalledWith(1);
//     });
//   });
//
//   describe('update', () => {
//     it('should update an event', () => {
//       const dto: UpdateEventDto = new UpdateEventDto();
//       dto.name = 'Updated Event';
//       expect(controller.update('1', dto)).toEqual({ id: 1, ...dto });
//       expect(service.update).toHaveBeenCalledWith(1, dto);
//     });
//   });
//
//   describe('remove', () => {
//     it('should remove an event', () => {
//       expect(controller.remove('1')).toEqual({ message: `Event with id 1 removed` });
//       expect(service.remove).toHaveBeenCalledWith(1);
//     });
//   });
// });
