
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
  referrerId?: string; // This will now be the voterNumber of the referrer
  isReferrer?: boolean;
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


const supporters: Supporter[] = [
  {
    voterNumber: '10000001',
    name: 'أبو مصطفى',
    surname: 'الكريم',
    age: 55,
    gender: 'ذكر',
    phoneNumber: '07700000001',
    educationalAttainment: 'اعدادية',
    registrationCenter: 'مركز تسجيل الكرخ',
    pollingCenter: 'مدرسة المتنبي',
    isReferrer: true,
  },
  {
    voterNumber: '10000002',
    name: 'الحاج سالم',
    surname: 'الجنابي',
    age: 60,
    gender: 'ذكر',
    phoneNumber: '07700000002',
    educationalAttainment: 'متوسطة',
    registrationCenter: 'مركز تسجيل الرصافة',
    pollingCenter: 'مدرسة الفراهيدي',
    isReferrer: true,
  },
  {
    voterNumber: '10000003',
    name: 'الشيخ علي',
    surname: 'العبيدي',
    age: 48,
    gender: 'ذكر',
    phoneNumber: '07700000003',
    educationalAttainment: 'بكالوريوس',
    registrationCenter: 'مركز تسجيل الاعظمية',
    pollingCenter: 'مسجد ومركز ابو حنيفة',
    isReferrer: true,
  },
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
    referrerId: '10000001', // voterNumber of أبو مصطفى
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
    referrerId: '10000002', // voterNumber of الحاج سالم
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
    referrerId: '10000001', // voterNumber of أبو مصطفى
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
        referrerId: '10000003', // voterNumber of الشيخ علي
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
  let allApprovedAndPending = [...supporters];
  if (checkPending) {
    allApprovedAndPending = [...supporters, ...pendingSupporters];
  }
  
  const supporter = allApprovedAndPending.find(s => s.voterNumber === voterNumber);

  if (supporter) {
      const referrer = supporter.referrerId ? supporters.find(r => r.voterNumber === supporter.referrerId) : undefined;
      return { ...supporter, referrerName: referrer ? `${referrer.name} ${referrer.surname}` : undefined };
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
        const referrer = s.referrerId ? supporters.find(r => r.voterNumber === s.referrerId) : undefined;
        return { ...s, referrerName: referrer ? `${referrer.name} ${referrer.surname}` : undefined };
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

export async function getAllSupporters(): Promise<(Supporter & { referrerName?: string })[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return supporters.map(s => {
        const referrer = s.referrerId ? supporters.find(r => r.voterNumber === s.referrerId) : undefined;
        return { ...s, referrerName: referrer ? `${referrer.name} ${referrer.surname}` : undefined };
    });
}

export async function getReferrers(): Promise<Supporter[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const referrers = supporters.filter(s => s.isReferrer);
    return referrers.map(s => {
        const referrer = s.referrerId ? supporters.find(r => r.voterNumber === s.referrerId) : undefined;
        return { ...s, referrerName: referrer ? `${referrer.name} ${referrer.surname}` : undefined };
    });
}

export async function toggleReferrerStatus(voterNumber: string): Promise<{ supporter: Supporter; isNowReferrer: boolean }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const supporter = supporters.find(s => s.voterNumber === voterNumber);
    if (!supporter) {
        throw new Error("لم يتم العثور على المؤيد.");
    }
    supporter.isReferrer = !supporter.isReferrer;
    return { supporter, isNowReferrer: !!supporter.isReferrer };
}
