export interface Supporter {
  voterNumber: string;
  name: string;
  surname: string;
  age: number;
  phoneNumber: string;
  pollingCenter: string;
}

const supporters: Supporter[] = [
  {
    voterNumber: '198501011234',
    name: 'أحمد',
    surname: 'المحمد',
    age: 39,
    phoneNumber: '07701234567',
    pollingCenter: 'مدرسة الرشيد الابتدائية',
  },
  {
    voterNumber: '199205155678',
    name: 'فاطمة',
    surname: 'علي',
    age: 32,
    phoneNumber: '07809876543',
    pollingCenter: 'إعدادية الفرات للبنات',
  },
  {
    voterNumber: '197811209012',
    name: 'خالد',
    surname: 'الحسن',
    age: 45,
    phoneNumber: '07901122334',
    pollingCenter: 'مركز شباب المدينة',
  },
];

export async function findSupporterByVoterNumber(voterNumber: string): Promise<Supporter | undefined> {
  // Simulate network delay for a more realistic loading state
  await new Promise(resolve => setTimeout(resolve, 750));
  const supporter = supporters.find(s => s.voterNumber === voterNumber);
  return supporter;
}

export async function addSupporter(supporter: Supporter): Promise<Supporter> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  supporters.push(supporter);
  return supporter;
}