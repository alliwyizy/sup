

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
  referrerName: string; // Added this
}

export type JoinRequest = Omit<Supporter, 'age' | 'referrerName'>;

export interface Referrer {
    id: string;
    name: string;
    // In a real app, you'd store a hashed password
    password: string; 
}


// Initial mock data
let referrers: Referrer[] = [
    { id: '1', name: 'Admin', password: 'password' },
    { id: '2', name: 'عمر علي', password: 'password123' },
    { id: '3', name: 'سارة محمود', password: 'password123' },
];

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
    referrerName: 'Admin',
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
    referrerName: 'عمر علي',
  },
];

let joinRequests: JoinRequest[] = [
    {
    voterNumber: '19900303',
    fullName: 'علي حسن كاظم',
    surname: 'الجنابي',
    birthYear: 1990,
    gender: 'ذكر',
    phoneNumber: '07901122334',
    education: 'دبلوم',
    registrationCenter: 'مركز تسجيل الأعظمية',
    pollingCenter: 'ثانوية المتميزين',
    pollingCenterNumber: '101010',
  },
];


// Supporter Functions
export async function findSupporterByVoterNumber(voterNumber: string): Promise<Supporter | undefined> {
  await new Promise(resolve => setTimeout(resolve, 100)); // Simulate network delay
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

// Join Request Functions
export async function getAllJoinRequests(): Promise<JoinRequest[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return [...joinRequests];
}

export async function findJoinRequestByVoterNumber(voterNumber: string): Promise<JoinRequest | undefined> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return joinRequests.find(r => r.voterNumber === voterNumber);
}


export async function getJoinRequest(voterNumber: string): Promise<JoinRequest | undefined> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return joinRequests.find(r => r.voterNumber === voterNumber);
}

export async function addJoinRequest(request: JoinRequest): Promise<JoinRequest> {
  await new Promise(resolve => setTimeout(resolve, 500));
  if (joinRequests.find(r => r.voterNumber === request.voterNumber)) {
    throw new Error("لديك طلب انضمام معلق بالفعل.");
  }
  joinRequests.push(request);
  return request;
}

export async function deleteJoinRequest(voterNumber: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 500));
  const requestIndex = joinRequests.findIndex(r => r.voterNumber === voterNumber);
  if (requestIndex === -1) {
    throw new Error("لم يتم العثور على طلب الانضمام لحذفه.");
  }
  joinRequests.splice(requestIndex, 1);
}


// Referrer Functions
export async function getAllReferrers(): Promise<Referrer[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...referrers];
}

export async function findReferrerByName(name: string): Promise<Referrer | undefined> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return referrers.find(r => r.name.toLowerCase() === name.toLowerCase());
}

export async function addReferrer(referrerData: Omit<Referrer, 'id'>): Promise<Referrer> {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (referrers.find(r => r.name.toLowerCase() === referrerData.name.toLowerCase())) {
        throw new Error("اسم المستخدم هذا مستخدم بالفعل.");
    }
    if (referrerData.name.toLowerCase() === 'admin' || referrerData.name.toLowerCase() === 'admin@example.com') {
      throw new Error("لا يمكن استخدام هذا الاسم المحجوز.");
    }
    const newReferrer = { ...referrerData, id: Date.now().toString() };
    referrers.push(newReferrer);
    return newReferrer;
}

export async function deleteReferrer(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const referrerToDelete = referrers.find(r => r.id === id);
    if (referrerToDelete?.name.toLowerCase() === 'admin') {
      throw new Error("لا يمكن حذف حساب المسؤول الرئيسي.");
    }
    const index = referrers.findIndex(r => r.id === id);
    if (index === -1) {
        throw new Error("لم يتم العثور على مدخل البيانات لحذفه.");
    }
    referrers.splice(index, 1);
}
