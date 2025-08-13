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

const pendingSupporters: Supporter[] = [
    {
        voterNumber: '200102038899',
        name: 'سارة',
        surname: 'الجاسم',
        age: 23,
        phoneNumber: '07711223344',
        pollingCenter: 'ثانوية دجلة للمتميزات',
    },
    {
        voterNumber: '199807107766',
        name: 'يوسف',
        surname: 'العامر',
        age: 26,
        phoneNumber: '07822334455',
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
