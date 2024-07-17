export class Patient {
  id?: string;
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
  name: string;

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
    id?: string
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
  }
}
