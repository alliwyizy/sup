
export interface Supporter {
  voterNumber: string;
  name: string;
  surname: string;
  age: number;
  phoneNumber: string;
  pollingCenter: string;
}

let supporters: Supporter[] = [
  {
    voterNumber: '19850101',
    name: 'أحمد',
    surname: 'المحمد',
    age: 39,
    phoneNumber: '07701234567',
    pollingCenter: 'مدرسة الرشيد الابتدائية',
  },
  {
    voterNumber: '19920515',
    name: 'فاطمة',
    surname: 'علي',
    age: 32,
    phoneNumber: '07809876543',
    pollingCenter: 'إعدادية الفرات للبنات',
  },
  {
    voterNumber: '19781120',
    name: 'خالد',
    surname: 'الحسن',
    age: 45,
    phoneNumber: '07901122334',
    pollingCenter: 'مركز شباب المدينة',
  },
  {
    voterNumber: '19950325',
    name: 'زينب',
    surname: 'الجنابي',
    age: 29,
    phoneNumber: '07712345678',
    pollingCenter: 'مدرسة الخنساء للبنات',
  },
  {
    voterNumber: '19800810',
    name: 'محمد',
    surname: 'الكعبي',
    age: 43,
    phoneNumber: '07819876543',
    pollingCenter: 'ثانوية المتميزين',
  }
];


export async function findSupporterByVoterNumber(voterNumber: string): Promise<Supporter | undefined> {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  return supporters.find(s => s.voterNumber === voterNumber);
}

export async function getAllSupporters(): Promise<Supporter[]> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    // sort by name
    return [...supporters].sort((a, b) => a.name.localeCompare(b.name));
}

export async function addSupporter(supporter: Supporter): Promise<Supporter> {
  await new Promise(resolve => setTimeout(resolve, 500));
  if (supporters.find(s => s.voterNumber === supporter.voterNumber)) {
    throw new Error("هذا المؤيد موجود بالفعل.");
  }
  supporters.push(supporter);
  return supporter;
}

export async function updateSupporter(updatedSupporter: Supporter): Promise<Supporter> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const supporterIndex = supporters.findIndex(s => s.voterNumber === updatedSupporter.voterNumber);
    if (supporterIndex === -1) {
        throw new Error("لم يتم العثور على المؤيد لتحديثه.");
    }
    supporters[supporterIndex] = updatedSupporter;
    return updatedSupporter;
}

export async function deleteSupporter(voterNumber: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const supporterIndex = supporters.findIndex(s => s.voterNumber === voterNumber);
    if (supporterIndex === -1) {
        throw new Error("لم يتم العثور على المؤيد لحذفه.");
    }
    supporters.splice(supporterIndex, 1);
}
