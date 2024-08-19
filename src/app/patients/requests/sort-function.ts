import { FirebaseService } from "../../firebase.service";
import { Carer } from "../../models/carer.model";
import { Patient } from "../../models/patient.model";

function skillMatch(array1: string[], array2: string[]): { matches: string[], percent: number } {
  // Convert arrays to sets for easier comparison
  const set1 = new Set(array1);
  const set2 = new Set(array2);

  // Calculate the number of matching elements
  const matches = [...set1].filter(item => set2.has(item));
  const totalUniqueElements = new Set([...set1, ...set2]).size;
  const matchPercentage = ((matches.length) / totalUniqueElements) * 100;
  return { matches: matches, percent: matchPercentage * 0.30 };
}

function locationMatch(patientLoc: string, carerLoc: string, dmode: boolean): number {
  if (dmode && (patientLoc === carerLoc)) return 20
  if (!dmode && (patientLoc.split(" ")[0] === carerLoc.split(" ")[0])) return 10
  return 0
}

function sortByPercentage(mapArray: Carer[]): Carer[] {
  return mapArray.sort((a, b) => b.matchPercent - a.matchPercent);
}


export async function matchCarerPatient(patient: Patient, carers: Carer[], fs: FirebaseService): Promise<Carer[]> {
  let specialisationNeeded: string[] = []
  await fs.getSpecialists().then(disease => {
    patient.medicalcondition.forEach(m => specialisationNeeded.push(...disease![m] as string[]))
  })
  carers.forEach(carer => {
    const skills = skillMatch(specialisationNeeded, carer.specialisation);
    carer.specialisation = skills.matches;
    carer.matchPercent = Number((40 + skills.percent
      + locationMatch(carer.location.district, patient.location.district, true)
      + locationMatch(carer.location.postcode, patient.location.postcode, false)).toFixed(1));
  })

  return sortByPercentage(carers);
}
