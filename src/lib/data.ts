
export interface Supporter {
  voterNumber: string;
  fullName: string;
  surname: string;
  birthYear: number;
  age: number;
  gender: 'ذكر' | 'انثى';
  phoneNumber: string;
  education: 'امي' | 'يقرا ويكتب' | 'ابتدائية' | 'متوسطة' | 'اعدادية' | 'طالب جامعة' | 'دبلوم' | 'بكالوريوس' | 'ماجستير' | 'دكتوراة';
  registrationCenter: string;
  pollingCenter: string;
  pollingCenterNumber: string;
}

// Initial mock data with the new structure
let supporters: Supporter[] = [
  {
    voterNumber: '19850101',
    fullName: 'أحمد محمد علي',
    surname: 'المحمد',
    birthYear: 1985,
    age: new Date().getFullYear() - 1985,
    gender: 'ذكر',
    phoneNumber: '07701234567',
    education: 'بكالوريوس',
    registrationCenter: 'مركز تسجيل الرصافة',
    pollingCenter: 'مدرسة الرشيد الابتدائية',
    pollingCenterNumber: '123456',
  },
  {
    voterNumber: '19920515',
    fullName: 'فاطمة عبدالله حسين',
    surname: 'علي',
    birthYear: 1992,
    age: new Date().getFullYear() - 1992,
    gender: 'انثى',
    phoneNumber: '07809876543',
    education: 'ماجستير',
    registrationCenter: 'مركز تسجيل الكرخ',
    pollingCenter: 'إعدادية الفرات للبنات',
    pollingCenterNumber: '654321',
  },
];


export async function findSupporterByVoterNumber(voterNumber: string): Promise<Supporter | undefined> {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  return supporters.find(s => s.voterNumber === voterNumber);
}

export async function getAllSupporters(): Promise<Supporter[]> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    // sort by name
    return [...supporters].sort((a, b) => a.fullName.localeCompare(b.fullName));
}

export async function addSupporter(supporter: Omit<Supporter, 'age'>): Promise<Supporter> {
  await new Promise(resolve => setTimeout(resolve, 500));
  if (supporters.find(s => s.voterNumber === supporter.voterNumber)) {
    throw new Error("هذا المؤيد موجود بالفعل.");
  }
  const age = new Date().getFullYear() - supporter.birthYear;
  const newSupporter = { ...supporter, age };
  supporters.push(newSupporter);
  return newSupporter;
}

export async function updateSupporter(updatedSupporter: Omit<Supporter, 'age'>): Promise<Supporter> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const supporterIndex = supporters.findIndex(s => s.voterNumber === updatedSupporter.voterNumber);
    if (supporterIndex === -1) {
        throw new Error("لم يتم العثور على المؤيد لتحديثه.");
    }
    const age = new Date().getFullYear() - updatedSupporter.birthYear;
    const newSupporter = { ...updatedSupporter, age };
    supporters[supporterIndex] = newSupporter;
    return newSupporter;
}

export async function deleteSupporter(voterNumber: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const supporterIndex = supporters.findIndex(s => s.voterNumber === voterNumber);
    if (supporterIndex === -1) {
        throw new Error("لم يتم العثور على المؤيد لحذفه.");
    }
    supporters.splice(supporterIndex, 1);
}
