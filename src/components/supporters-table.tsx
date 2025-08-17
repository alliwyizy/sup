

"use client";

import * as React from "react";
import { MoreHorizontal, Pencil, Trash2, Search, FileDown } from "lucide-react";
import * as xlsx from "xlsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Supporter, AuditStatus } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditSupporterForm } from "./edit-supporter-form";
import { DeleteSupporterDialog } from "./delete-supporter-dialog";
import { Skeleton } from "./ui/skeleton";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";

interface SupportersTableProps {
  data: Supporter[];
  onDataChange: () => void;
  loading: boolean;
  isAdmin: boolean;
}

const PAGE_SIZE = 50;
const educationLevels = ['الكل', 'امي', 'يقرا ويكتب', 'ابتدائية', 'متوسطة', 'اعدادية', 'طالب جامعة', 'دبلوم', 'بكالوريوس', 'ماجستير', 'دكتوراة'];
const genderLevels = ['الكل', 'ذكر', 'انثى'];
const auditStatuses: (AuditStatus | 'الكل')[] = ['الكل', 'لم يتم التدقيق', 'تم التدقيق', 'مشكلة في التدقيق'];

export function SupportersTable({ data, onDataChange, loading, isAdmin }: SupportersTableProps) {
  const [isEditDialogOpen, setEditDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [selectedSupporter, setSelectedSupporter] = React.useState<Supporter | null>(null);
  
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filters, setFilters] = React.useState({ 
    education: 'الكل', 
    gender: 'الكل', 
    auditStatus: 'الكل',
    pollingCenter: 'الكل',
    referrerName: 'الكل',
    registrationCenter: 'الكل',
  });
  const [currentPage, setCurrentPage] = React.useState(1);

  // Memoize filter options
  const filterOptions = React.useMemo(() => {
    const pollingCenters = ['الكل', ...new Set(data.map(s => s.pollingCenter))];
    const referrerNames = ['الكل', ...new Set(data.map(s => s.referrerName))];
    const registrationCenters = ['الكل', ...new Set(data.map(s => s.registrationCenter))];
    return { pollingCenters, referrerNames, registrationCenters };
  }, [data]);
  
  const filteredData = React.useMemo(() => {
    let filtered = data;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(supporter =>
        supporter.fullName.toLowerCase().includes(searchLower) ||
        supporter.surname.toLowerCase().includes(searchLower) ||
        supporter.voterNumber.includes(searchTerm) ||
        supporter.phoneNumber.includes(searchTerm)
      );
    }
    if (filters.education !== 'الكل') {
      filtered = filtered.filter(supporter => supporter.education === filters.education);
    }
    if (filters.gender !== 'الكل') {
      filtered = filtered.filter(supporter => supporter.gender === filters.gender);
    }
     if (filters.pollingCenter !== 'الكل') {
      filtered = filtered.filter(supporter => supporter.pollingCenter === filters.pollingCenter);
    }
    if (filters.registrationCenter !== 'الكل') {
        filtered = filtered.filter(supporter => supporter.registrationCenter === filters.registrationCenter);
    }
    if (isAdmin) {
        if (filters.auditStatus !== 'الكل') {
            filtered = filtered.filter(supporter => supporter.auditStatus === filters.auditStatus);
        }
        if (filters.referrerName !== 'الكل') {
            filtered = filtered.filter(supporter => supporter.referrerName === filters.referrerName);
        }
    }
    return filtered;
  }, [data, searchTerm, filters, isAdmin]);
  
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredData.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredData, currentPage]);
  
  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);

  const handleFilterChange = (filterName: keyof typeof filters) => (value: string) => {
      setFilters(prev => ({ ...prev, [filterName]: value }));
  };
  
  const handleEdit = (supporter: Supporter) => {
    setSelectedSupporter(supporter);
    setEditDialogOpen(true);
  };
  
  const handleDelete = (supporter: Supporter) => {
    setSelectedSupporter(supporter);
    setDeleteDialogOpen(true);
  };
  
  const handleSuccess = () => {
    onDataChange();
  };
  
  const handleExport = () => {
    const exportData = filteredData.map(s => {
      const baseData: any = {
        'رقم الناخب': s.voterNumber,
        'الاسم الكامل': s.fullName,
        'اللقب': s.surname,
        'سنة الميلاد': s.birthYear,
        'العمر': s.age,
        'الجنس': s.gender,
        'رقم الهاتف': s.phoneNumber,
        'التحصيل الدراسي': s.education,
        'مركز التسجيل': s.registrationCenter,
        'مركز الاقتراع': s.pollingCenter,
        'رقم مركز الاقتراع': s.pollingCenterNumber,
      };
      if (isAdmin) {
        baseData['حالة التدقيق'] = s.auditStatus;
        baseData['أضيف بواسطة'] = s.referrerName;
      }
      return baseData;
    });

    const worksheet = xlsx.utils.json_to_sheet(exportData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "المؤيدون");
    xlsx.writeFile(workbook, `بيانات_المؤيدين_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const getAuditStatusVariant = (status: AuditStatus): "default" | "secondary" | "destructive" => {
    switch(status) {
        case 'تم التدقيق': return 'default';
        case 'مشكلة في التدقيق': return 'destructive';
        case 'لم يتم التدقيق': return 'secondary';
        default: return 'secondary';
    }
  }

  const tableHeadersBase = [
    "رقم الناخب", "الاسم الكامل", "اللقب", "العمر", "الجنس", "رقم الهاتف", 
    "التحصيل الدراسي"
  ];
  
  let tableHeaders = [...tableHeadersBase];
  if (isAdmin) {
    tableHeaders.push("حالة التدقيق");
  }
  tableHeaders.push("مركز التسجيل", "مركز الاقتراع", "رقم المركز");
  if (isAdmin) {
    tableHeaders.push("أضيف بواسطة");
  }
  tableHeaders.push("إجراءات");


  if (loading) {
     return (
        <div className="w-full overflow-x-auto rounded-md border">
            <div className="p-4 space-y-4">
                <Skeleton className="h-10 w-1/3" />
                 <div className="flex gap-4">
                    <Skeleton className="h-10 w-1/4" />
                    <Skeleton className="h-10 w-1/4" />
                </div>
            </div>
            <Table>
                <TableHeader>
                <TableRow>
                    {tableHeaders.map((header) => <TableHead key={header} className="text-center">{header}</TableHead>)}
                </TableRow>
                </TableHeader>
                <TableBody>
                    {[...Array(10)].map((_, i) => (
                        <TableRow key={i}>
                            {tableHeaders.map((h, j) => <TableCell key={j}><Skeleton className="h-6 w-full" /></TableCell>)}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
     )
  }

  return (
    <>
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                    placeholder="بحث بالاسم، اللقب، رقم الناخب، أو الهاتف..." 
                    className="pl-10 text-right"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>
            {isAdmin && (
                 <Button onClick={handleExport} variant="outline" disabled={filteredData.length === 0}>
                    <FileDown className="ml-2 h-4 w-4" />
                    تصدير إلى Excel
                </Button>
            )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">تصفية حسب التحصيل الدراسي:</label>
                 <Select onValueChange={handleFilterChange('education')} defaultValue="الكل">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        {educationLevels.map(level => <SelectItem key={level} value={level}>{level}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
             <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">تصفية حسب الجنس:</label>
                <Select onValueChange={handleFilterChange('gender')} defaultValue="الكل">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        {genderLevels.map(level => <SelectItem key={level} value={level}>{level}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            {isAdmin && (
                 <div className="flex-1 space-y-2">
                    <label className="text-sm font-medium">تصفية حسب حالة التدقيق:</label>
                    <Select onValueChange={handleFilterChange('auditStatus')} defaultValue="الكل">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {auditStatuses.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            )}
             <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">تصفية حسب مركز الاقتراع:</label>
                <Select onValueChange={handleFilterChange('pollingCenter')} defaultValue="الكل">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        {filterOptions.pollingCenters.map(center => <SelectItem key={center} value={center}>{center}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">تصفية حسب مركز التسجيل:</label>
                <Select onValueChange={handleFilterChange('registrationCenter')} defaultValue="الكل">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        {filterOptions.registrationCenters.map(center => <SelectItem key={center} value={center}>{center}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            {isAdmin && (
                 <div className="flex-1 space-y-2">
                    <label className="text-sm font-medium">تصفية حسب مدخل البيانات:</label>
                    <Select onValueChange={handleFilterChange('referrerName')} defaultValue="الكل">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {filterOptions.referrerNames.map(name => <SelectItem key={name} value={name}>{name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            )}
        </div>
      </div>

      <div className="w-full overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              {tableHeaders.map((header) => (
                <TableHead key={header} className="text-center font-bold text-foreground whitespace-nowrap">{header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? paginatedData.map((supporter) => (
              <TableRow key={supporter.voterNumber}>
                <TableCell className="text-center">{supporter.voterNumber}</TableCell>
                <TableCell className="text-center font-medium">{supporter.fullName}</TableCell>
                <TableCell className="text-center">{supporter.surname}</TableCell>
                <TableCell className="text-center">{supporter.age}</TableCell>
                <TableCell className="text-center">{supporter.gender}</TableCell>
                <TableCell dir="ltr" className="text-center">{supporter.phoneNumber}</TableCell>
                <TableCell className="text-center">{supporter.education}</TableCell>
                {isAdmin && 
                    <TableCell className="text-center">
                        <Badge variant={getAuditStatusVariant(supporter.auditStatus)}>{supporter.auditStatus}</Badge>
                    </TableCell>
                }
                <TableCell className="text-center">{supporter.registrationCenter}</TableCell>
                <TableCell className="text-center">{supporter.pollingCenter}</TableCell>
                <TableCell className="text-center">{supporter.pollingCenterNumber}</TableCell>
                {isAdmin && <TableCell className="text-center">{supporter.referrerName}</TableCell>}
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">فتح القائمة</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleEdit(supporter)}>
                        <Pencil className="ml-2 h-4 w-4" />
                        تعديل
                      </DropdownMenuItem>
                       <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" onClick={() => handleDelete(supporter)}>
                         <Trash2 className="ml-2 h-4 w-4" />
                         حذف
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={tableHeaders.length} className="h-24 text-center">
                  {data.length === 0 ? "لا يوجد بيانات لعرضها حاليًا. قم بإضافة مؤيد جديد للبدء." : "لم يتم العثور على نتائج مطابقة للبحث أو التصفية."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

       <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          {filteredData.length} نتيجة
        </div>
        <div className="flex items-center space-x-4" dir="ltr">
            <span className="text-sm text-muted-foreground">
                صفحة {currentPage} من {totalPages}
            </span>
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    السابق
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    التالي
                </Button>
            </div>
        </div>
      </div>

       {selectedSupporter && (
         <>
            <EditSupporterForm
                supporter={selectedSupporter}
                isOpen={isEditDialogOpen}
                onOpenChange={setEditDialogOpen}
                onSuccess={handleSuccess}
            />
            <DeleteSupporterDialog
                supporter={selectedSupporter}
                isOpen={isDeleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onSuccess={handleSuccess}
            />
         </>
      )}
    </>
  );
}

    

    

    