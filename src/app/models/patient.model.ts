import { Location } from "./carer.model";

export class Patient {
  id?: string;
  photo?: string;
  age: number;
  bloodtype: string;
  doctor: string;
  email: string;
  gender: string;
  hospital: string;
  insuranceprovider: string;
  medicalcondition: string[];
  medication: {
    morning: string[];
    noon: string[];
    night: string[];
  };
  location!: Location;
  name: string;
  assigned?: boolean;

  constructor(
    age: number,
    bloodtype: string,
    doctor: string,
    email: string,
    gender: string,
    hospital: string,
    insuranceprovider: string,
    medicalcondition: string[],
    medication: { morning: string[], noon: string[], night: string[] },
    name: string,
    location: Location,
    id?: string,
    photo?: string,
    assigned?: boolean
  ) {
    this.id = id;
    this.age = age;
    this.bloodtype = bloodtype;
    this.doctor = doctor;
    this.email = email;
    this.gender = gender;
    this.hospital = hospital;
    this.insuranceprovider = insuranceprovider;
    this.medicalcondition = medicalcondition;
    this.medication = medication;
    this.name = name;
    this.photo = photo;
    this.location = location;
    this.assigned = assigned;
  }
}
