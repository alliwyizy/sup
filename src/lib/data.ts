
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
  referrerId?: string;
}

export interface Referrer {
  id: string;
  name: string;
}

// This simulates a general database of all voters
const generalVoterDatabase: Supporter[] = [
  {
    voterNumber: '11112222',
    name: 'علي',
    surname: 'خالد',
    age: 40,
    gender: "ذكر",
    phoneNumber: '07711111111',
    educationalAttainment: "بكالوريوس",
    registrationCenter: "مركز تسجيل الرصافة",
    pollingCenter: 'مدرسة دجلة',
  },
   {
    voterNumber: '33334444',
    name: 'نور',
    surname: 'الهدى',
    age: 28,
    gender: "انثى",
    phoneNumber: '07822222222',
    educationalAttainment: "ماجستير",
    registrationCenter: "مركز تسجيل الكرخ",
    pollingCenter: 'إعدادية بغداد للبنات',
  },
];


const referrers: Referrer[] = [
    { id: 'ref1', name: 'أبو مصطفى' },
    { id: 'ref2', name: 'الحاج سالم' },
    { id: 'ref3', name: 'الشيخ علي' },
];

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
    referrerId: 'ref1',
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
    referrerId: 'ref2',
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
    referrerId: 'ref1',
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
        referrerId: 'ref3',
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

export async function findInGeneralVoterDatabase(voterNumber: string): Promise<Supporter | undefined> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return generalVoterDatabase.find(v => v.voterNumber === voterNumber);
}


export async function findSupporterByVoterNumber(voterNumber: string, checkPending = false): Promise<(Supporter & { referrerName?: string }) | undefined> {
  await new Promise(resolve => setTimeout(resolve, 750));
  let supporter = supporters.find(s => s.voterNumber === voterNumber);
  if (checkPending && !supporter) {
    supporter = pendingSupporters.find(s => s.voterNumber === voterNumber);
  }

  if (supporter) {
      const referrer = supporter.referrerId ? referrers.find(r => r.id === supporter.referrerId) : undefined;
      return { ...supporter, referrerName: referrer?.name };
  }

  return undefined;
}

export async function addSupporter(supporter: Supporter): Promise<Supporter> {
  await new Promise(resolve => setTimeout(resolve, 500));
  supporters.push(supporter);
  return supporter;
}

export async function addPendingSupporter(supporter: Supporter): Promise<Supporter> {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (supporters.find(s => s.voterNumber === supporter.voterNumber) || pendingSupporters.find(s => s.voterNumber === supporter.voterNumber)) {
        throw new Error("Supporter already exists or is pending approval.");
    }
    pendingSupporters.push(supporter);
    return supporter;
}

export async function getPendingSupporters(): Promise<(Supporter & { referrerName?: string })[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return pendingSupporters.map(s => {
        const referrer = s.referrerId ? referrers.find(r => r.id === s.referrerId) : undefined;
        return { ...s, referrerName: referrer?.name };
    });
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


export async function getReferrers(): Promise<Referrer[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...referrers];
}

export async function addReferrer(name: string): Promise<Referrer> {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (referrers.find(r => r.name.trim().toLowerCase() === name.trim().toLowerCase())) {
        throw new Error("المعرّف موجود بالفعل.");
    }
    const newReferrer: Referrer = {
        id: `ref${Date.now()}`,
        name: name,
    };
    referrers.push(newReferrer);
    return newReferrer;
}
