export interface Supporter {
  voterNumber: string;
  name: string;
  surname: string;
  age: number;
  gender: "ذكر" | "انثى";
  phoneNumber: string;
  educationalAttainment: "امي" | "يقرأ ويكتب" | "ابتدائية" | "متوسطة" | "اعدادية" | "طالب جامعة" | "دبلوم" | "بكالوريوس" | "ماجستير" | "دكتوراة";
  registrationCenter: string;
  pollingCenter: string;
}

const supporters: Supporter[] = [
  {
    voterNumber: '19850101',
    name: 'أحمد',
    surname: 'المحمد',
    age: 39,
    gender: "ذكر",
    phoneNumber: '07701234567',
    educationalAttainment: "بكالوريوس",
    registrationCenter: "مركز تسجيل الرصافة",
    pollingCenter: 'مدرسة الرشيد الابتدائية',
  },
  {
    voterNumber: '19920515',
    name: 'فاطمة',
    surname: 'علي',
    age: 32,
    gender: "انثى",
    phoneNumber: '07809876543',
    educationalAttainment: "ماجستير",
    registrationCenter: "مركز تسجيل الكرخ",
    pollingCenter: 'إعدادية الفرات للبنات',
  },
  {
    voterNumber: '19781120',
    name: 'خالد',
    surname: 'الحسن',
    age: 45,
    gender: "ذكر",
    phoneNumber: '07901122334',
    educationalAttainment: "اعدادية",
    registrationCenter: "مركز تسجيل الأعظمية",
    pollingCenter: 'مركز شباب المدينة',
  },
];

const pendingSupporters: Supporter[] = [
    {
        voterNumber: '20010203',
        name: 'سارة',
        surname: 'الجاسم',
        age: 23,
        gender: "انثى",
        phoneNumber: '07711223344',
        educationalAttainment: "طالب جامعة",
        registrationCenter: "مركز تسجيل المنصور",
        pollingCenter: 'ثانوية دجلة للمتميزات',
    },
    {
        voterNumber: '19980710',
        name: 'يوسف',
        surname: 'العامر',
        age: 26,
        gender: "ذكر",
        phoneNumber: '07822334455',
        educationalAttainment: "دبلوم",
        registrationCenter: "مركز تسجيل الكاظمية",
        pollingCenter: 'مدرسة النهضة الأساسية',
    }
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

export async function addPendingSupporter(supporter: Supporter): Promise<Supporter> {
    await new Promise(resolve => setTimeout(resolve, 500));
    // check if user is already a supporter or pending
    if (supporters.find(s => s.voterNumber === supporter.voterNumber) || pendingSupporters.find(s => s.voterNumber === supporter.voterNumber)) {
        throw new Error("Supporter already exists or is pending approval.");
    }
    pendingSupporters.push(supporter);
    return supporter;
}

export async function getPendingSupporters(): Promise<Supporter[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...pendingSupporters];
}

export async function approveSupporter(voterNumber: string): Promise<Supporter> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const supporterIndex = pendingSupporters.findIndex(s => s.voterNumber === voterNumber);
    if (supporterIndex === -1) {
        throw new Error("Pending supporter not found.");
    }
    const [approvedSupporter] = pendingSupporters.splice(supporterIndex, 1);
    supporters.push(approvedSupporter);
    return approvedSupporter;
}

export async function rejectSupporter(voterNumber: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const supporterIndex = pendingSupporters.findIndex(s => s.voterNumber === voterNumber);
    if (supporterIndex === -1) {
        throw new Error("Pending supporter not found.");
    }
    pendingSupporters.splice(supporterIndex, 1);
}
