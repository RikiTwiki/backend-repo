import { Injectable } from '@nestjs/common';

@Injectable()
export class RoomService {
  constructor(roomRepository) {
    this.roomRepository = roomRepository;
  }

  async getAllRooms() {
    return this.roomRepository.find();
  }

  async getRoomById(id) {
    return this.roomRepository.findOne(id);
  }

  async createRoom(roomData) {
    return this.roomRepository.save(roomData);
  }
}