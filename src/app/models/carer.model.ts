export class Location {
  district!: string;
  latitude!: number;
  longitude!: number;
  postcode!: string;

  constructor(
    district: string,
    latitude: number,
    longitude: number,
    postcode: string
  ) {
    this.district = district;
    this.latitude = latitude;
    this.longitude = longitude;
    this.postcode = postcode;
  }
}

export class Schedule {
  monday?: [number, number];
  tuesday?: [number, number];
  wednesday?: [number, number];
  thursday?: [number, number];
  friday?: [number, number];
  saturday?: [number, number];
  sunday?: [number, number];

  constructor(
    monday?: [number, number],
    tuesday?: [number, number],
    wednesday?: [number, number],
    thursday?: [number, number],
    friday?: [number, number],
    saturday?: [number, number],
    sunday?: [number, number],
  ) {
    this.monday = monday;
    this.tuesday = tuesday;
    this.wednesday = wednesday;
    this.thursday = thursday;
    this.friday = friday;
    this.saturday = saturday;
    this.sunday = sunday;
  }
}

export class Carer {
  id!: string;
  name!: string;
  age!: number;
  gender!: string;
  email!: string;
  photo!: string;
  location!: Location;
  schedule!: Schedule;
  matchPercent: number;
  specialisation!: string[];

  constructor(
    id: string,
    name: string,
    age: number,
    gender: string,
    email: string,
    photo: string,
    location: Location,
    schedule: Schedule,
    matchPercent: number,
    specialisation: string[]
  ) {
    this.id = id;
    this.name = name;
    this.age = age;
    this.gender = gender;
    this.email = email;
    this.photo = photo;
    this.location = location;
    this.schedule = schedule;
    this.matchPercent = matchPercent;
    this.specialisation = specialisation;
  }
}
